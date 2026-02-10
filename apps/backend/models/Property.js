import { DataTypes } from 'sequelize'
import db from '../config/db.js'
import { User } from './User.js'

export const Property = db.define('properties', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },

  // Basic information
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'title',
    validate: {
      notEmpty: {
        msg: 'Title is required'
      }
    }
  },
  slug: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: true,
    field: 'slug'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'description'
  },

  // Property type and operation
  propertyType: {
    type: DataTypes.ENUM('house', 'apartment', 'land', 'commercial', 'office', 'warehouse'),
    allowNull: false,
    field: 'property_type',
    validate: {
      isIn: {
        args: [['house', 'apartment', 'land', 'commercial', 'office', 'warehouse']],
        msg: 'Invalid property type'
      }
    }
  },
  operationType: {
    type: DataTypes.ENUM('sale', 'rent', 'temporary'),
    allowNull: false,
    field: 'operation_type',
    validate: {
      isIn: {
        args: [['sale', 'rent', 'temporary']],
        msg: 'Invalid operation type'
      }
    }
  },

  // Price
  price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    field: 'price',
    validate: {
      min: {
        args: [0],
        msg: 'Price cannot be negative'
      }
    }
  },
  currency: {
    type: DataTypes.ENUM('USD', 'ARS', 'EUR'),
    defaultValue: 'USD',
    field: 'currency'
  },

  // Location
  address: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'address'
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'city'
  },
  state: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'state'
  },
  postalCode: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'postal_code'
  },
  country: {
    type: DataTypes.STRING(100),
    defaultValue: 'Argentina',
    field: 'country'
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true,
    field: 'latitude',
    validate: {
      min: -90,
      max: 90
    }
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true,
    field: 'longitude',
    validate: {
      min: -180,
      max: 180
    }
  },

  // Features
  totalArea: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    field: 'total_area',
    validate: {
      min: 0
    }
  },
  coveredArea: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    field: 'covered_area',
    validate: {
      min: 0
    }
  },
  bedrooms: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'bedrooms',
    validate: {
      min: 0
    }
  },
  bathrooms: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'bathrooms',
    validate: {
      min: 0
    }
  },
  garages: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'garages',
    validate: {
      min: 0
    }
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'age',
    validate: {
      min: 0
    }
  },

  // Status and management
  status: {
    type: DataTypes.ENUM('available', 'reserved', 'sold', 'rented'),
    defaultValue: 'available',
    field: 'status'
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'featured'
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'active'
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'views',
    validate: {
      min: 0
    }
  },

  // Main image (cache)
  mainImageUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'main_image_url'
  },

  // Dates
  publicationDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'publication_date'
  }
}, {
  timestamps: true,
  underscored: true,
  paranoid: true, // Enables soft delete (deleted_at)

  // Hooks
  hooks: {
    beforeCreate: async (property) => {
      // Generate slug automatically if it doesn't exist
      if (!property.slug && property.title) {
        property.slug = generateSlug(property.title)
      }
    },
    beforeUpdate: async (property) => {
      // Regenerate slug if title changed
      if (property.changed('title') && property.title) {
        property.slug = generateSlug(property.title)
      }
    }
  },

  // Scopes
  scopes: {
    available: {
      where: {
        status: 'available',
        active: true
      }
    },
    featured: {
      where: {
        featured: true,
        active: true
      }
    },
    byCity: (city) => ({
      where: { city }
    }),
    forSale: {
      where: {
        operationType: 'sale',
        active: true
      }
    },
    forRent: {
      where: {
        operationType: 'rent',
        active: true
      }
    },
    withUser: {
      include: [{
        model: User,
        as: 'owner',
        attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
      }]
    }
  },

  // Indexes
  indexes: [
    {
      name: 'idx_properties_type',
      fields: ['property_type', 'operation_type']
    },
    {
      name: 'idx_properties_price',
      fields: ['price']
    },
    {
      name: 'idx_properties_city',
      fields: ['city', 'state']
    },
    {
      name: 'idx_properties_status',
      fields: ['status', 'active']
    },
    {
      name: 'idx_properties_user',
      fields: ['user_id']
    },
    {
      name: 'idx_properties_slug',
      fields: ['slug']
    }
  ]
})

// Helper function to generate slug
function generateSlug (text) {
  return text
    .toLowerCase()
    .normalize('NFD') // Normalize accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove multiple hyphens
    .substring(0, 255) // Limit to 255 characters
}

// Relationships (defined after importing all models)
Property.belongsTo(User, {
  foreignKey: 'userId',
  as: 'owner',
  onDelete: 'CASCADE'
})

User.hasMany(Property, {
  foreignKey: 'userId',
  as: 'properties'
})
