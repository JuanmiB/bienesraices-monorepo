import { DataTypes } from 'sequelize'
import db from '../config/db.js'
import { logger } from '../helpers/logger.js'

export const Amenity = db.define('amenities', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    field: 'name',
    validate: {
      notEmpty: {
        msg: 'Amenity name is required'
      }
    }
  },
  icon: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'icon',
    comment: 'Icon name associated with the amenity'
  },
  category: {
    type: DataTypes.ENUM('interior', 'exterior', 'services', 'security'),
    defaultValue: 'services',
    field: 'category',
    validate: {
      isIn: {
        args: [['interior', 'exterior', 'services', 'security']],
        msg: 'Invalid category'
      }
    }
  }
}, {
  timestamps: false, // Don't need created_at/updated_at
  underscored: true,

  // Scopes
  scopes: {
    byCategory: (category) => ({
      where: { category }
    }),
    ordered: {
      order: [['category', 'ASC'], ['name', 'ASC']]
    }
  },

  // Indexes
  indexes: [
    {
      name: 'idx_amenities_name',
      unique: true,
      fields: ['name']
    },
    {
      name: 'idx_amenities_category',
      fields: ['category']
    }
  ]
})

// Static methods
Amenity.getByCategory = async function (category) {
  return await Amenity.findAll({
    where: { category },
    order: [['name', 'ASC']]
  })
}

Amenity.getAll = async function () {
  return await Amenity.scope('ordered').findAll()
}

Amenity.getGroupedByCategory = async function () {
  const amenities = await Amenity.findAll({
    order: [['category', 'ASC'], ['name', 'ASC']]
  })

  // Group by category
  return amenities.reduce((acc, amenity) => {
    if (!acc[amenity.category]) {
      acc[amenity.category] = []
    }
    acc[amenity.category].push(amenity)
    return acc
  }, {})
}

// Method to create default amenities
Amenity.createDefaultAmenities = async function () {
  const defaultAmenities = [
    // Interior
    { name: 'Air conditioning', icon: 'Wind', category: 'interior' },
    { name: 'Heating', icon: 'Flame', category: 'interior' },
    { name: 'Equipped kitchen', icon: 'ChefHat', category: 'interior' },
    { name: 'Washing machine', icon: 'WashingMachine', category: 'interior' },
    { name: 'Furnished', icon: 'Armchair', category: 'interior' },
    { name: 'Built-in closet', icon: 'Cabinet', category: 'interior' },
    { name: 'Balcony', icon: 'DoorOpen', category: 'interior' },

    // Exterior
    { name: 'Pool', icon: 'Waves', category: 'exterior' },
    { name: 'Garden', icon: 'Trees', category: 'exterior' },
    { name: 'BBQ/Grill area', icon: 'Beef', category: 'exterior' },
    { name: 'Terrace', icon: 'Home', category: 'exterior' },
    { name: 'Deck', icon: 'LayoutDashboard', category: 'exterior' },
    { name: 'Covered garage', icon: 'Warehouse', category: 'exterior' },

    // Services
    { name: 'Gym', icon: 'Dumbbell', category: 'services' },
    { name: 'Multipurpose room', icon: 'Users', category: 'services' },
    { name: 'Elevator', icon: 'MoveVertical', category: 'services' },
    { name: 'Doorman/Concierge', icon: 'UserCheck', category: 'services' },
    { name: 'Laundry room', icon: 'Sparkles', category: 'services' },
    { name: 'WiFi', icon: 'Wifi', category: 'services' },
    { name: 'Cable/Internet', icon: 'Tv', category: 'services' },
    { name: 'Natural gas', icon: 'Flame', category: 'services' },

    // Security
    { name: '24/7 Security', icon: 'Shield', category: 'security' },
    { name: 'Security cameras', icon: 'Camera', category: 'security' },
    { name: 'Gated community', icon: 'Home', category: 'security' },
    { name: 'Alarm system', icon: 'Bell', category: 'security' },
    { name: 'Automatic gate', icon: 'DoorClosed', category: 'security' }
  ]

  try {
    await Amenity.bulkCreate(defaultAmenities, {
      ignoreDuplicates: true // Don't fail if they already exist
    })
    logger.info('Amenities por defecto creadas exitosamente')
  } catch (error) {
    logger.error('Error al crear amenities por defecto', { error: error.message })
  }
}
