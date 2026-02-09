// models/PropertyAmenity.js
import { DataTypes } from 'sequelize'
import db from '../config/db.js'
import { Property } from './Property.js'
import { Amenity } from './Amenity.js'

export const PropertyAmenity = db.define('property_amenities', {
  propertyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'property_id',
    references: {
      model: 'properties',
      key: 'id'
    },
    primaryKey: true
  },
  amenityId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'amenity_id',
    references: {
      model: 'amenities',
      key: 'id'
    },
    primaryKey: true
  }
}, {
  timestamps: false,
  underscored: true,
  tableName: 'property_amenities',

  // Indexes
  indexes: [
    {
      name: 'idx_prop_amenities_property',
      fields: ['property_id']
    },
    {
      name: 'idx_prop_amenities_amenity',
      fields: ['amenity_id']
    }
  ]
})

// Many-to-Many Relationships
Property.belongsToMany(Amenity, {
  through: PropertyAmenity,
  foreignKey: 'propertyId',
  otherKey: 'amenityId',
  as: 'amenities',
  onDelete: 'CASCADE'
})

Amenity.belongsToMany(Property, {
  through: PropertyAmenity,
  foreignKey: 'amenityId',
  otherKey: 'propertyId',
  as: 'properties',
  onDelete: 'CASCADE'
})

// Useful static methods
PropertyAmenity.getPropertyAmenities = async function (propertyId) {
  return await PropertyAmenity.findAll({
    where: { propertyId },
    include: [{
      model: db.models.Amenity,
      attributes: ['id', 'name', 'icon', 'category']
    }]
  })
}

PropertyAmenity.getPropertiesWithAmenity = async function (amenityId) {
  return await PropertyAmenity.findAll({
    where: { amenityId }
  })
}

PropertyAmenity.checkIfHas = async function (propertyId, amenityId) {
  const record = await PropertyAmenity.findOne({
    where: { propertyId, amenityId }
  })
  return !!record
}
