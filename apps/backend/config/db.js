import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

// Cargar las variables de entorno desde .env si no estás en producción
if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

// Configuración de la base de datos
// En producción (Render), usa DATABASE_URL que incluye todos los parámetros
// En desarrollo, usa variables individuales
let db

if (process.env.DATABASE_URL) {
  // Producción: Usar DATABASE_URL de Render (PostgreSQL)
  db = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    define: {
      timestamps: true
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: false
  })
} else {
  // Desarrollo: Usar variables individuales (MySQL)
  db = new Sequelize(process.env.DB_NOMBRE, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    port: 3306,
    dialect: 'mysql',
    define: {
      timestamps: true
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  })
}

export default db
