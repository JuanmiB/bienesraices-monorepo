import db from '../config/db.js'
import { exit } from 'node:process'
import { User, Property, PropertyImage } from '../models/index.js'

// ─── Usuarios ─────────────────────────────────────────────────
// password se hashea automáticamente en el hook beforeCreate del modelo User
const usersData = [
  {
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan@juan.com',
    password: 'password',
    userType: 'owner',
    verified: true,
    active: true
  },
  {
    firstName: 'María',
    lastName: 'García',
    email: 'maria@maria.com',
    password: 'password',
    userType: 'owner',
    verified: true,
    active: true
  }
]

// ─── Propiedades ──────────────────────────────────────────────
// slug se genera automáticamente en el hook beforeCreate del modelo Property
// status default: 'available' | country default: 'Argentina'
const propertiesData = [
  // ── Houses ──
  {
    userId: 1,
    title: 'Casa en Barrio Norte',
    description: 'Hermosa casa con jardín amplio y pileta. Ubicada en una zona tranquila con excelente conectividad.',
    propertyType: 'house',
    operationType: 'sale',
    price: 285000,
    currency: 'USD',
    address: 'Av. Santa Fe 1234',
    city: 'Buenos Aires',
    state: 'CABA',
    postalCode: '1059',
    latitude: -34.5975,
    longitude: -58.4043,
    totalArea: 250,
    coveredArea: 195,
    bedrooms: 3,
    bathrooms: 2,
    garages: 1,
    age: 15,
    featured: true,
    active: true,
    mainImageUrl: 'https://picsum.photos/seed/prop1/800/600'
  },
  {
    userId: 1,
    title: 'Casa en Tigre',
    description: 'Casa en zona tranquila, cerca del río. Ideal para vivir en un ambiente natural y apacible.',
    propertyType: 'house',
    operationType: 'sale',
    price: 320000,
    currency: 'USD',
    address: 'Calle Italia 330',
    city: 'Tigre',
    state: 'Buenos Aires',
    postalCode: '1670',
    latitude: -34.4256,
    longitude: -58.5793,
    totalArea: 300,
    coveredArea: 220,
    bedrooms: 4,
    bathrooms: 3,
    garages: 1,
    age: 20,
    featured: true,
    active: true,
    mainImageUrl: 'https://picsum.photos/seed/prop2/800/600'
  },
  {
    userId: 2,
    title: 'Casa de estilo francés en Belgrano R',
    description: 'Casa de estilo francés con gran parque, árboles añejos y zona muy tranquila.',
    propertyType: 'house',
    operationType: 'sale',
    price: 450000,
    currency: 'USD',
    address: 'Calle Sucre 1890',
    city: 'Buenos Aires',
    state: 'CABA',
    postalCode: '1426',
    latitude: -34.5684,
    longitude: -58.4571,
    totalArea: 400,
    coveredArea: 310,
    bedrooms: 5,
    bathrooms: 4,
    garages: 2,
    age: 45,
    featured: false,
    active: true,
    mainImageUrl: 'https://picsum.photos/seed/prop3/800/600'
  },
  {
    userId: 2,
    title: 'Casa quinta en Pilar',
    description: 'Amplia casa quinta con quincho, pileta y jardín exuberante. Perfecta para una familia.',
    propertyType: 'house',
    operationType: 'sale',
    price: 580000,
    currency: 'USD',
    address: 'Calle Champagnat 453',
    city: 'Pilar',
    state: 'Buenos Aires',
    postalCode: '1630',
    latitude: -34.4536,
    longitude: -58.9184,
    totalArea: 500,
    coveredArea: 350,
    bedrooms: 5,
    bathrooms: 4,
    garages: 2,
    age: 10,
    featured: true,
    active: true,
    mainImageUrl: 'https://picsum.photos/seed/prop4/800/600'
  },
  {
    userId: 1,
    title: 'Casa en San Isidro',
    description: 'Casa con jardín y pileta en zona residencial abierta. Muy cerca del tren.',
    propertyType: 'house',
    operationType: 'rent',
    price: 1800,
    currency: 'USD',
    address: 'Calle Roque Sáenz Peña 1020',
    city: 'San Isidro',
    state: 'Buenos Aires',
    postalCode: '1704',
    latitude: -34.4697,
    longitude: -58.5098,
    totalArea: 300,
    coveredArea: 210,
    bedrooms: 4,
    bathrooms: 3,
    garages: 2,
    age: 25,
    featured: false,
    active: true,
    mainImageUrl: 'https://picsum.photos/seed/prop5/800/600'
  },

  // ── Apartments & PH ──
  {
    userId: 1,
    title: 'Departamento en Palermo',
    description: 'Moderno departamento con balcón y vista al parque. A pasos de las mejores cafeterías de Palermo.',
    propertyType: 'apartment',
    operationType: 'sale',
    price: 195000,
    currency: 'USD',
    address: 'Calle Gurruchaga 2754',
    city: 'Buenos Aires',
    state: 'CABA',
    postalCode: '1425',
    latitude: -34.5863,
    longitude: -58.4311,
    totalArea: 85,
    coveredArea: 78,
    bedrooms: 2,
    bathrooms: 1,
    garages: 0,
    age: 8,
    featured: true,
    active: true,
    mainImageUrl: 'https://picsum.photos/seed/prop6/800/600'
  },
  {
    userId: 2,
    title: 'Departamento en Almagro',
    description: 'Cómodo departamento de 2 ambientes cerca del subte. Excelente ubicación para moverse por la ciudad.',
    propertyType: 'apartment',
    operationType: 'rent',
    price: 950,
    currency: 'USD',
    address: 'Medrano 1555',
    city: 'Buenos Aires',
    state: 'CABA',
    postalCode: '1414',
    latitude: -34.6065,
    longitude: -58.4183,
    totalArea: 60,
    coveredArea: 55,
    bedrooms: 1,
    bathrooms: 1,
    garages: 0,
    age: 12,
    featured: false,
    active: true,
    mainImageUrl: 'https://picsum.photos/seed/prop7/800/600'
  },
  {
    userId: 1,
    title: 'Departamento en Núñez',
    description: 'Moderno departamento con balcón terraza en edificio de alta altura.',
    propertyType: 'apartment',
    operationType: 'sale',
    price: 175000,
    currency: 'USD',
    address: 'Av. Libertador 7800',
    city: 'Buenos Aires',
    state: 'CABA',
    postalCode: '1428',
    latitude: -34.5376,
    longitude: -58.4651,
    totalArea: 90,
    coveredArea: 82,
    bedrooms: 2,
    bathrooms: 2,
    garages: 1,
    age: 5,
    featured: false,
    active: true,
    mainImageUrl: 'https://picsum.photos/seed/prop8/800/600'
  },
  {
    userId: 2,
    title: 'Penthouse en Puerto Madero',
    description: 'Exclusivo penthouse con vista panorámica al río. Acabados de lujo en todo el departamento.',
    propertyType: 'apartment',
    operationType: 'sale',
    price: 720000,
    currency: 'USD',
    address: 'Alicia Moreau de Justo 1020',
    city: 'Buenos Aires',
    state: 'CABA',
    postalCode: '1107',
    latitude: -34.6123,
    longitude: -58.3602,
    totalArea: 250,
    coveredArea: 230,
    bedrooms: 3,
    bathrooms: 3,
    garages: 2,
    age: 3,
    featured: true,
    active: true,
    mainImageUrl: 'https://picsum.photos/seed/prop9/800/600'
  },
  {
    userId: 1,
    title: 'PH en Caballito',
    description: 'PH con patio y terraza privada. Tranquilidad en el corazón de la ciudad.',
    propertyType: 'apartment',
    operationType: 'sale',
    price: 310000,
    currency: 'USD',
    address: 'Av. Rivadavia 4500',
    city: 'Buenos Aires',
    state: 'CABA',
    postalCode: '1406',
    latitude: -34.6232,
    longitude: -58.4423,
    totalArea: 120,
    coveredArea: 105,
    bedrooms: 3,
    bathrooms: 2,
    garages: 1,
    age: 18,
    featured: false,
    active: true,
    mainImageUrl: 'https://picsum.photos/seed/prop10/800/600'
  },
  {
    userId: 2,
    title: 'PH en Boedo',
    description: 'PH con entrada independiente y patio propio. Ideal para una familia pequeña.',
    propertyType: 'apartment',
    operationType: 'rent',
    price: 1200,
    currency: 'USD',
    address: 'Calle San Juan 2650',
    city: 'Buenos Aires',
    state: 'CABA',
    postalCode: '1430',
    latitude: -34.6207,
    longitude: -58.4078,
    totalArea: 95,
    coveredArea: 88,
    bedrooms: 3,
    bathrooms: 2,
    garages: 0,
    age: 22,
    featured: false,
    active: true,
    mainImageUrl: 'https://picsum.photos/seed/prop11/800/600'
  },
  {
    userId: 1,
    title: 'Loft industrial en San Telmo',
    description: 'Loft industrial en edificio histórico rehabilitado. Techos altos y espacios abiertos.',
    propertyType: 'apartment',
    operationType: 'sale',
    price: 240000,
    currency: 'USD',
    address: 'Defensa 750',
    city: 'Buenos Aires',
    state: 'CABA',
    postalCode: '1126',
    latitude: -34.6181,
    longitude: -58.3704,
    totalArea: 75,
    coveredArea: 70,
    bedrooms: 1,
    bathrooms: 1,
    garages: 0,
    age: 40,
    featured: true,
    active: true,
    mainImageUrl: 'https://picsum.photos/seed/prop12/800/600'
  },

  // ── Land ──
  {
    userId: 1,
    title: 'Terreno en Zona Norte',
    description: 'Terreno amplio y plano, ideal para construir una casa. En un barrio residencial consolidado.',
    propertyType: 'land',
    operationType: 'sale',
    price: 120000,
    currency: 'USD',
    address: 'Calle Las Palmeras 800',
    city: 'San Isidro',
    state: 'Buenos Aires',
    postalCode: '1704',
    latitude: -34.475,
    longitude: -58.498,
    totalArea: 600,
    coveredArea: 0,
    bedrooms: 0,
    bathrooms: 0,
    garages: 0,
    age: 0,
    featured: false,
    active: true,
    mainImageUrl: 'https://picsum.photos/seed/prop13/800/600'
  },

  // ── Commercial ──
  {
    userId: 2,
    title: 'Local comercial en Corrientes',
    description: 'Local con excelente ubicación sobre Av. Corrientes. Ideal para gastronómico o comercio minorista.',
    propertyType: 'commercial',
    operationType: 'rent',
    price: 2500,
    currency: 'USD',
    address: 'Av. Corrientes 3200',
    city: 'Buenos Aires',
    state: 'CABA',
    postalCode: '1414',
    latitude: -34.6034,
    longitude: -58.4215,
    totalArea: 180,
    coveredArea: 175,
    bedrooms: 0,
    bathrooms: 1,
    garages: 0,
    age: 30,
    featured: true,
    active: true,
    mainImageUrl: 'https://picsum.photos/seed/prop14/800/600'
  },

  // ── Office ──
  {
    userId: 1,
    title: 'Oficina en Microcentro',
    description: 'Oficina moderna en edificio corporativo. Con recepción, sala de reuniones y estacionamiento incluido.',
    propertyType: 'office',
    operationType: 'rent',
    price: 1900,
    currency: 'USD',
    address: 'Av. Florida 500',
    city: 'Buenos Aires',
    state: 'CABA',
    postalCode: '1061',
    latitude: -34.6038,
    longitude: -58.3713,
    totalArea: 120,
    coveredArea: 115,
    bedrooms: 0,
    bathrooms: 1,
    garages: 2,
    age: 6,
    featured: false,
    active: true,
    mainImageUrl: 'https://picsum.photos/seed/prop15/800/600'
  },

  // ── Warehouse ──
  {
    userId: 2,
    title: 'Depósito en Avellaneda',
    description: 'Depósito espacioso con acceso directo a la ruta. Ideal para logística y almacenamiento.',
    propertyType: 'warehouse',
    operationType: 'rent',
    price: 3200,
    currency: 'USD',
    address: 'Av. Belgrano 1500',
    city: 'Avellaneda',
    state: 'Buenos Aires',
    postalCode: '1850',
    latitude: -34.648,
    longitude: -58.489,
    totalArea: 2000,
    coveredArea: 1800,
    bedrooms: 0,
    bathrooms: 2,
    garages: 0,
    age: 12,
    featured: false,
    active: true,
    mainImageUrl: 'https://picsum.photos/seed/prop16/800/600'
  }
]

// ─── Imágenes ─────────────────────────────────────────────────
// Una imagen primaria por propiedad; las propiedades pares reciben una segunda imagen.
// mainImageUrl ya está seteado en cada propiedad → no se necesitan hooks de PropertyImage.
const imagesData = propertiesData.flatMap((_, index) => {
  const propId = index + 1
  const base = `https://picsum.photos/seed/prop${propId}`

  const primary = {
    propertyId: propId,
    publicId: `seed/prop${propId}_main`,
    url: `${base}/800/600`,
    thumbnailUrl: `${base}/300/200`,
    isPrimary: true,
    order: 0
  }

  if (propId % 2 === 0) {
    return [primary, {
      propertyId: propId,
      publicId: `seed/prop${propId}_alt`,
      url: `https://picsum.photos/seed/prop${propId}b/800/600`,
      thumbnailUrl: `https://picsum.photos/seed/prop${propId}b/300/200`,
      isPrimary: false,
      order: 1
    }]
  }

  return [primary]
})

// ─── Importar datos ───────────────────────────────────────────
const importarDatos = async (closeConnection = true) => {
  try {
    await db.authenticate()
    await db.sync()

    // Orden: users → properties (FK) → property_images (FK)
    // individualHooks: true para disparar beforeCreate (hash de password / generación de slug)
    await User.bulkCreate(usersData, { individualHooks: true })
    await Property.bulkCreate(propertiesData, { individualHooks: true })
    await PropertyImage.bulkCreate(imagesData)

    console.log(`Datos insertados: ${usersData.length} usuarios, ${propertiesData.length} propiedades, ${imagesData.length} imágenes`)
  } catch (error) {
    console.error('Error al insertar datos:', error)
    throw error
  } finally {
    if (closeConnection) {
      await db.close()
      exit()
    }
  }
}

// ─── Eliminar datos ───────────────────────────────────────────
const eliminarDatos = async () => {
  if (process.env.NODE_ENV === 'production') {
    console.error('¡Eliminar datos no está permitido en producción!')
    exit(1)
  }
  try {
    await db.sync({ force: true })
    console.log('Datos eliminados correctamente')
  } catch (error) {
    console.error('Error al eliminar datos:', error)
  } finally {
    await db.close()
    exit()
  }
}

// ─── CLI ──────────────────────────────────────────────────────
const mostrarAyuda = () => {
  console.log(`
    Uso: npm run db:importar | npm run db:eliminar

      -i   Importar datos (usuarios, propiedades, imágenes)
      -e   Eliminar datos  (force drop — bloqueado en producción)
      -h   Mostrar esta ayuda
  `)
}

const main = () => {
  const arg = process.argv[2]

  if (arg === '-i') {
    importarDatos()
  } else if (arg === '-e') {
    eliminarDatos()
  } else {
    mostrarAyuda()
    if (arg && arg !== '-h') {
      console.error(`Argumento no válido: ${arg}`)
      exit(1)
    }
  }
}

// Exportar funciones para uso en endpoints
export { importarDatos, eliminarDatos }

// Solo ejecutar main si se llama directamente desde CLI
if (process.argv[1] && process.argv[1].includes('seeder.js')) {
  main()
}
