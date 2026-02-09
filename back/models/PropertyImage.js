import { DataTypes } from 'sequelize'
import db from '../config/db.js'
import { Property } from './Property.js'

export const PropertyImage = db.define('property_images', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  propertyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'property_id',
    references: {
      model: 'properties',
      key: 'id'
    }
  },
  publicId: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'public_id',
    comment: 'Cloudinary public ID'
  },
  url: {
    type: DataTypes.STRING(500),
    allowNull: false,
    validate: {
      isUrl: {
        msg: 'Must be a valid URL'
      }
    }
  },
  thumbnailUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'thumbnail_url',
    validate: {
      isUrl: {
        msg: 'Must be a valid URL'
      }
    }
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'order',
    validate: {
      min: 0
    }
  },
  isPrimary: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_primary'
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'description'
  }
}, {
  timestamps: true,
  underscored: true,
  updatedAt: false, // Only need created_at

  // Hooks
  hooks: {
    beforeCreate: async (image) => {
      // If there's no thumbnail_url, use the main URL with transformation
      if (!image.thumbnailUrl && image.url) {
        image.thumbnailUrl = generateThumbnailUrl(image.url)
      }
    },
    afterCreate: async (image) => {
      // If it's the primary image, unmark the others
      if (image.isPrimary) {
        await PropertyImage.update(
          { isPrimary: false },
          {
            where: {
              propertyId: image.propertyId,
              id: { [db.Sequelize.Op.ne]: image.id }
            }
          }
        )

        // Update the main URL in the properties table
        await Property.update(
          { mainImageUrl: image.url },
          { where: { id: image.propertyId } }
        )
      }
    },
    beforeUpdate: async (image) => {
      // If marked as primary, unmark the others
      if (image.changed('isPrimary') && image.isPrimary) {
        await PropertyImage.update(
          { isPrimary: false },
          {
            where: {
              propertyId: image.propertyId,
              id: { [db.Sequelize.Op.ne]: image.id }
            }
          }
        )

        // Update the main URL in the properties table
        await Property.update(
          { mainImageUrl: image.url },
          { where: { id: image.propertyId } }
        )
      }
    },
    beforeDestroy: async (image) => {
      // If the primary image is deleted, set another as primary
      if (image.isPrimary) {
        const next = await PropertyImage.findOne({
          where: {
            propertyId: image.propertyId,
            id: { [db.Sequelize.Op.ne]: image.id }
          },
          order: [['order', 'ASC']]
        })

        if (next) {
          await next.update({ isPrimary: true })
        } else {
          // No more images, clear the main URL
          await Property.update(
            { mainImageUrl: null },
            { where: { id: image.propertyId } }
          )
        }
      }
    }
  },

  // Scopes
  scopes: {
    ordered: {
      order: [['order', 'ASC'], ['id', 'ASC']]
    },
    primary: {
      where: { isPrimary: true },
      limit: 1
    }
  },

  // Indexes
  indexes: [
    {
      name: 'idx_property_images_property',
      fields: ['property_id']
    },
    {
      name: 'idx_property_images_primary',
      fields: ['property_id', 'is_primary']
    },
    {
      name: 'idx_property_images_order',
      fields: ['property_id', 'order']
    }
  ]
})

// Helper function to generate thumbnail URL
function generateThumbnailUrl (url) {
  // If it's a Cloudinary URL, add transformation
  if (url.includes('cloudinary.com')) {
    // Insert transformation before the filename
    // Original: https://res.cloudinary.com/demo/image/upload/v1234/sample.jpg
    // Thumbnail: https://res.cloudinary.com/demo/image/upload/w_300,h_200,c_fill/v1234/sample.jpg
    return url.replace('/upload/', '/upload/w_300,h_200,c_fill,q_auto/')
  }
  return url
}

// Instance methods
PropertyImage.prototype.setAsPrimary = async function () {
  this.isPrimary = true
  await this.save()
}

PropertyImage.prototype.getTransformedUrl = function (transformations = {}) {
  if (!this.url.includes('cloudinary.com')) return this.url

  const { width, height, crop = 'fill', quality = 'auto' } = transformations
  const transform = []

  if (width) transform.push(`w_${width}`)
  if (height) transform.push(`h_${height}`)
  if (crop) transform.push(`c_${crop}`)
  if (quality) transform.push(`q_${quality}`)

  const transformString = transform.join(',')
  return this.url.replace('/upload/', `/upload/${transformString}/`)
}

// Static methods
PropertyImage.getGallery = async function (propertyId) {
  return await PropertyImage.scope('ordered').findAll({
    where: { propertyId }
  })
}

PropertyImage.getPrimary = async function (propertyId) {
  return await PropertyImage.findOne({
    where: {
      propertyId,
      isPrimary: true
    }
  })
}

PropertyImage.reorder = async function (propertyId, orderIds) {
  // orderIds is an array with the IDs in the new order
  // Example: [5, 2, 8, 1] means image 5 goes first
  const promises = orderIds.map((id, index) =>
    PropertyImage.update(
      { order: index },
      { where: { id, propertyId } }
    )
  )

  return await Promise.all(promises)
}

PropertyImage.deleteByPublicId = async function (publicId) {
  const image = await PropertyImage.findOne({ where: { publicId } })
  if (image) {
    await image.destroy()
  }
  return image
}

// Relationships
PropertyImage.belongsTo(Property, {
  foreignKey: 'propertyId',
  as: 'property',
  onDelete: 'CASCADE'
})

Property.hasMany(PropertyImage, {
  foreignKey: 'propertyId',
  as: 'images',
  onDelete: 'CASCADE'
})
