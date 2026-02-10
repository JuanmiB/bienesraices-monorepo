import { Property } from './Property.js'
import { User } from './User.js'
import { PropertyImage } from './PropertyImage.js'
import { Amenity } from './Amenity.js'
import { PropertyAmenity } from './PropertyAmenity.js'

// Nota: Las relaciones están definidas en sus respectivos archivos de modelo
// - User-Property: Property.js
// - PropertyImage-Property: PropertyImage.js
// - Property-Amenity (many-to-many): PropertyAmenity.js

export {
  Property,
  User,
  PropertyImage,
  Amenity,
  PropertyAmenity
}
