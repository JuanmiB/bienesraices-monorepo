# Documentación Completa del Backend - Bienes Raíces

## Tabla de Contenidos
1. [Introducción](#introducción)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Configuración y Variables de Entorno](#configuración-y-variables-de-entorno)
4. [Modelos de Base de Datos](#modelos-de-base-de-datos)
5. [Rutas y Endpoints](#rutas-y-endpoints)
6. [Controladores](#controladores)
7. [Middleware](#middleware)
8. [Helpers y Utilidades](#helpers-y-utilidades)
9. [Servicios](#servicios)
10. [Recomendaciones y Correcciones](#recomendaciones-y-correcciones)

---

## Introducción

Este backend está desarrollado con **Node.js**, **Express**, **Sequelize ORM** y **MySQL**. Implementa un sistema de gestión de propiedades inmobiliarias con autenticación JWT, manejo de imágenes en Cloudinary, y funcionalidades completas de CRUD.

### Tecnologías Principales
- **Express**: Framework web para Node.js
- **Sequelize**: ORM para MySQL
- **JWT**: Autenticación basada en tokens
- **Cloudinary**: Almacenamiento de imágenes
- **Nodemailer**: Envío de correos electrónicos
- **Bcrypt**: Encriptación de contraseñas
- **Express Validator**: Validación de datos

### Stack de Seguridad
- **Helmet**: Protección de headers HTTP
- **CORS**: Control de acceso de origen cruzado
- **Rate Limiting**: Protección contra ataques de fuerza bruta
- **Cookie Parser**: Manejo seguro de cookies

---

## Estructura del Proyecto

```
back/
├── config/               # Configuraciones
│   ├── cloudinary.js    # Configuración de Cloudinary
│   ├── db.js            # Configuración de base de datos
│   ├── multer.js        # Configuración de Multer
│   └── passport.js      # Configuración de Passport JWT
├── controllers/         # Controladores de rutas
│   ├── adminController.js
│   ├── appController.js
│   └── authController.js
├── helpers/            # Funciones auxiliares
│   ├── email.js
│   ├── logger.js
│   └── recoveryPasswordToken.js
├── middleware/         # Middlewares personalizados
│   ├── authMiddleware.js
│   ├── errorHandler.js
│   ├── identifyUser.js
│   └── validation.js
├── models/            # Modelos de Sequelize
│   ├── Amenity.js
│   ├── Categoria.js
│   ├── index.js
│   ├── Property.js
│   ├── PropertyAmenity.js
│   ├── PropertyImage.js
│   └── User.js
├── router/           # Definición de rutas
│   ├── adminRouter.js
│   ├── appRouter.js
│   └── authRouter.js
├── schema/          # Esquemas de base de datos
│   └── propieadad.schema.js
├── seed/           # Seeders
│   └── seeder.js
├── services/      # Servicios externos
│   └── email.js
├── .env.example  # Ejemplo de variables de entorno
├── package.json
└── server.js    # Punto de entrada
```

---

## Configuración y Variables de Entorno

### Variables de Entorno Requeridas

El archivo `.env` debe contener las siguientes variables:

```env
# Base de Datos
DB_NOMBRE=bienesraices-react
DB_USER=root
DB_PASS=tu_contraseña_aqui
DB_HOST=localhost

# URLs
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:1234

# JWT
JWT_SECRET=tu_clave_jwt_super_segura_aqui_minimo_32_caracteres

# Email (Mailtrap para desarrollo)
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=tu_user_mailtrap
EMAIL_PASS=tu_pass_mailtrap

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Entorno
NODE_ENV=development
PORT=1234
```

### Configuraciones

#### 1. Base de Datos (`config/db.js`)
```javascript
// Configuración de Sequelize con MySQL
- Pool de conexiones: max 5, min 0
- Timeout de adquisición: 30 segundos
- Idle timeout: 10 segundos
- Timestamps automáticos habilitados
```

#### 2. Cloudinary (`config/cloudinary.js`)
```javascript
// Configuración para almacenamiento de imágenes
- Cloud name, API key y API secret desde variables de entorno
```

#### 3. Multer (`config/multer.js`)
```javascript
// Almacenamiento temporal en memoria
- Usado para subir imágenes antes de enviarlas a Cloudinary
```

#### 4. Passport JWT (`config/passport.js`)
```javascript
// Estrategia de autenticación
- Extrae JWT de la cookie '_token'
- Verifica con JWT_SECRET
- Busca usuario en base de datos con scope 'hideInfo'
```

**⚠️ PROBLEMA DETECTADO**: El archivo importa `Usuario` pero debería importar `User` (línea 22).

---

## Modelos de Base de Datos

### 1. User (`models/User.js`)

**Tabla**: `users`

**Campos**:
- `id`: INTEGER, PK, autoincrement
- `firstName`: STRING(100), requerido
- `lastName`: STRING(100), opcional
- `email`: STRING(255), requerido, único, validado
- `password`: STRING(255), hasheado con bcrypt
- `phone`: STRING(50), opcional
- `googleId`: STRING(255), para login social
- `avatarUrl`: STRING(500), URL del avatar
- `recoveryToken`: STRING, token de recuperación de contraseña
- `recoveryTokenExpiration`: DATE
- `verificationToken`: STRING, token de verificación de email
- `verificationTokenExpiration`: DATE
- `userType`: ENUM('owner', 'agent', 'admin', 'buyer'), default: 'buyer'
- `verified`: BOOLEAN, default: false
- `active`: BOOLEAN, default: true
- `registrationDate`: DATE, default: NOW
- `lastSession`: DATE, última sesión del usuario

**Hooks**:
- `beforeCreate`: Hashea la contraseña con bcrypt (salt 10)
- `beforeUpdate`: Hashea la contraseña solo si cambió

**Scopes**:
- `hideInfo`: Excluye password, tokens, googleId, timestamps
- `public`: Solo muestra id, firstName, lastName, avatarUrl, userType

**Métodos de Instancia**:
- `verifyPassword(password)`: Compara contraseña con hash
- `updateLastSession()`: Actualiza fecha de última sesión

**Métodos Estáticos**:
- `findByEmail(email)`: Busca usuario por email
- `findByGoogleId(googleId)`: Busca usuario por Google ID

**Relaciones**:
- `hasMany` → Property (como 'properties')

---

### 2. Property (`models/Property.js`)

**Tabla**: `properties`

**Campos**:
- `id`: INTEGER, PK, autoincrement
- `userId`: INTEGER, FK → users.id, requerido
- `title`: STRING(255), requerido
- `slug`: STRING(255), único, generado automáticamente
- `description`: TEXT
- `propertyType`: ENUM('house', 'apartment', 'land', 'commercial', 'office', 'warehouse')
- `operationType`: ENUM('sale', 'rent', 'temporary')
- `price`: DECIMAL(12,2), requerido, ≥ 0
- `currency`: ENUM('USD', 'ARS', 'EUR'), default: 'USD'
- `address`: STRING(255)
- `city`: STRING(100)
- `state`: STRING(100)
- `postalCode`: STRING(20)
- `country`: STRING(100), default: 'Argentina'
- `latitude`: DECIMAL(10,8), -90 a 90
- `longitude`: DECIMAL(11,8), -180 a 180
- `totalArea`: DECIMAL(10,2), ≥ 0
- `coveredArea`: DECIMAL(10,2), ≥ 0
- `bedrooms`: INTEGER, ≥ 0
- `bathrooms`: INTEGER, ≥ 0
- `garages`: INTEGER, ≥ 0
- `age`: INTEGER, ≥ 0
- `status`: ENUM('available', 'reserved', 'sold', 'rented'), default: 'available'
- `featured`: BOOLEAN, default: false
- `active`: BOOLEAN, default: true
- `views`: INTEGER, default: 0
- `mainImageUrl`: STRING(500), cache de imagen principal
- `publicationDate`: DATE, default: NOW

**Características**:
- Soft delete habilitado (`paranoid: true`)
- Índices en tipo, precio, ciudad, estado, usuario, slug

**Hooks**:
- `beforeCreate`: Genera slug automáticamente desde el título
- `beforeUpdate`: Regenera slug si el título cambió

**Scopes**:
- `available`: Propiedades disponibles y activas
- `featured`: Propiedades destacadas
- `byCity(city)`: Filtrar por ciudad
- `forSale`: En venta
- `forRent`: En alquiler
- `withUser`: Incluye datos del propietario

**Métodos de Instancia**:
- `incrementViews()`: Incrementa contador de vistas
- `markAsSold()`: Marca como vendida e inactiva
- `markAsRented()`: Marca como alquilada e inactiva
- `setFeatured()`: Marca como destacada

**Métodos Estáticos**:
- `findBySlug(slug)`: Busca por slug con datos del owner
- `findAvailable(filters)`: Busca propiedades disponibles con filtros

**Relaciones**:
- `belongsTo` → User (como 'owner')
- `hasMany` → PropertyImage (como 'images')
- `belongsToMany` → Amenity (a través de PropertyAmenity)

---

### 3. PropertyImage (`models/PropertyImage.js`)

**Tabla**: `property_images`

**Campos**:
- `id`: INTEGER, PK, autoincrement
- `propertyId`: INTEGER, FK → properties.id
- `publicId`: STRING(255), Cloudinary public ID
- `url`: STRING(500), URL completa
- `thumbnailUrl`: STRING(500), URL del thumbnail
- `order`: INTEGER, orden de visualización
- `isPrimary`: BOOLEAN, imagen principal
- `description`: STRING(255)

**Hooks**:
- `beforeCreate`: Genera thumbnailUrl si no existe
- `afterCreate`: Si es primary, desmarca las demás y actualiza Property.mainImageUrl
- `beforeUpdate`: Si cambia a primary, desmarca las demás
- `beforeDestroy`: Si es primary, asigna otra imagen como principal

**Métodos de Instancia**:
- `setAsPrimary()`: Marca como imagen principal
- `getTransformedUrl(transformations)`: Genera URL con transformaciones de Cloudinary

**Métodos Estáticos**:
- `getGallery(propertyId)`: Obtiene todas las imágenes ordenadas
- `getPrimary(propertyId)`: Obtiene imagen principal
- `reorder(propertyId, orderIds)`: Reordena imágenes
- `deleteByPublicId(publicId)`: Elimina por public ID

**Relaciones**:
- `belongsTo` → Property

---

### 4. Amenity (`models/Amenity.js`)

**Tabla**: `amenities`

**Campos**:
- `id`: INTEGER, PK, autoincrement
- `name`: STRING(100), requerido, único
- `icon`: STRING(100), nombre del ícono
- `category`: ENUM('interior', 'exterior', 'services', 'security')

**Características**:
- Sin timestamps

**Métodos Estáticos**:
- `getByCategory(category)`: Obtiene amenities por categoría
- `getAll()`: Obtiene todos ordenados
- `getGroupedByCategory()`: Agrupa por categoría
- `createDefaultAmenities()`: Crea amenities por defecto (25 predefinidas)

**Relaciones**:
- `belongsToMany` → Property (a través de PropertyAmenity)

---

### 5. PropertyAmenity (`models/PropertyAmenity.js`)

**Tabla**: `property_amenities` (tabla intermedia)

**Campos**:
- `propertyId`: INTEGER, PK, FK → properties.id
- `amenityId`: INTEGER, PK, FK → amenities.id

**Métodos Estáticos**:
- `getPropertyAmenities(propertyId)`: Amenities de una propiedad
- `getPropertiesWithAmenity(amenityId)`: Propiedades con un amenity
- `checkIfHas(propertyId, amenityId)`: Verifica si tiene amenity

---

### 6. Categoria (`models/Categoria.js`)

**Tabla**: `categorias`

**Campos**:
- `id`: INTEGER, PK, autoincrement
- `name`: STRING(30), requerido

**⚠️ NOTA**: Este modelo existe pero NO está relacionado con Property. La tabla `properties` no tiene columna `categoria_id`.

---

## Rutas y Endpoints

### 1. Rutas Públicas (`router/appRouter.js`)

**Base URL**: `/`

| Método | Ruta | Descripción | Validación | Controlador |
|--------|------|-------------|-----------|-------------|
| GET | `/` | Obtiene datos del home (categorías) | - | `getHomeData` |
| GET | `/categorias` | Lista todas las categorías | - | `getCategorias` |
| GET | `/usuarios/:id` | Obtiene datos de un usuario | UUID | `getUsuario` |
| GET | `/categorias/buscar/:id` | Busca propiedad por ID de categoría | Category ID | `getById` |
| GET | `/buscar` | Búsqueda general de propiedades | Query string | `buscar` |
| GET | `/buscar/categoria` | Búsqueda por categoría | Query string | `buscarPorCategoria` |
| GET | `/propiedades/:id` | Obtiene una propiedad por ID | UUID | `getPropiedad` |
| GET | `/propiedades` | Lista todas las propiedades | - | `getAllPropiedades` |

**Query Parameters**:
- `/propiedades?limit=10`: Limita resultados
- `/buscar?query=casa&category=departamento`: Búsqueda con filtros

---

### 2. Rutas de Autenticación (`router/authRouter.js`)

**Base URL**: `/auth`

**Rate Limit**: 5 intentos por minuto

| Método | Ruta | Descripción | Validación | Controlador |
|--------|------|-------------|-----------|-------------|
| POST | `/register` | Registro de nuevo usuario | `validateRegister` | `registrarUsuario` |
| POST | `/login` | Inicio de sesión | `validateLogin` | `authentication` |
| GET | `/verify` | Verifica autenticación actual | - | `verifyAuth` |
| POST | `/logout` | Cierra sesión | - | `cerrarSesion` |
| GET | `/verify/:token` | Verifica email de usuario | - | `verifyEmail` |
| POST | `/recover-password` | Solicita recuperación de contraseña | `validateRecoverPassword` | `recoverPassword` |
| GET | `/reset-password/:token` | Verifica token de recuperación | - | `verifyToken` |
| POST | `/reset-password/:token` | Restablece contraseña | `validateResetPassword` | `resetPassword` |

---

### 3. Rutas de Administración (`router/adminRouter.js`)

**Base URL**: `/admin`

**Autenticación**: Todas las rutas requieren `authMiddleware`

| Método | Ruta | Descripción | Validación | Upload | Controlador |
|--------|------|-------------|-----------|--------|-------------|
| GET | `/mis-propiedades` | Lista propiedades del usuario | - | - | `getMisPropiedades` |
| POST | `/mis-propiedades/crear-propiedad` | Crea nueva propiedad | `validateCreatePropiedad` | ✅ | `crearPropiedad` |
| GET | `/mis-propiedades/editar/:id` | Obtiene propiedad para editar | UUID | - | `editarPropiedad` |
| PUT | `/mis-propiedades/editar/:id` | Actualiza propiedad | UUID | ✅ | `actualizarPropiedad` |
| DELETE | `/mis-propiedades/eliminar/:id` | Elimina propiedad | UUID | - | `eliminarPropiedad` |
| PATCH | `/mis-propiedades/estado/:id` | Cambia estado de publicación | UUID | - | `changePublish` |

**Upload**: Multer con campo `imagen` (single file)

---

## Controladores

### 1. App Controller (`controllers/appController.js`)

#### `getHomeData`
**Descripción**: Devuelve categorías hardcodeadas para el home.

**Respuesta**:
```json
{
  "categorias": ["Casa", "Departamento", "Terreno", "Oficina", "Local Comercial"]
}
```

**⚠️ NOTA**: Las categorías están hardcodeadas, no vienen de la BD.

---

#### `getUsuario`
**Descripción**: Obtiene datos de un usuario por ID.

**Parámetros**: `id` (UUID)

**Respuesta**:
```json
{
  "id": 1,
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan@example.com",
  ...
}
```

**Errores**:
- 404: Usuario no encontrado
- 500: Error del servidor

---

#### `getPropiedad`
**Descripción**: Obtiene una propiedad con sus imágenes y propietario.

**Incluye**:
- PropertyImage (como 'images')
- User (como 'owner': id, firstName, lastName, email)

**Errores**:
- 404: Propiedad no encontrada

---

#### `getAllPropiedades`
**Descripción**: Lista todas las propiedades ordenadas por fecha de creación.

**Query Params**:
- `limit`: Número de resultados (opcional)

**Incluye**:
- PropertyImage
- User (owner)

**Orden**: Más recientes primero

---

#### `buscar`
**Descripción**: Búsqueda avanzada de propiedades.

**Query Params**:
- `query`: Término de búsqueda (título, descripción, dirección)
- `category`: Categoría (actualmente no funcional)

**Lógica**:
- Busca en título, descripción y dirección con `LIKE`
- Usa operador `Op.or` para múltiples campos

**⚠️ PROBLEMA**: La búsqueda por categoría está deshabilitada porque Property no tiene `categoria_id`.

**Respuesta**:
```json
{
  "success": true,
  "data": [...]
}
```

**Errores**:
- 404: No se encontraron resultados

---

#### `buscarPorCategoria`
**Descripción**: Busca propiedades por categoría.

**⚠️ PROBLEMA**: Actualmente devuelve TODAS las propiedades porque no hay relación con Categoria.

---

#### `getById`
**Descripción**: Obtiene una propiedad por ID (usado para categorías).

**⚠️ NOTA**: El nombre es confuso. Debería llamarse `getPropiedadById`.

---

#### `getCategorias`
**Descripción**: Obtiene todas las categorías de la BD.

**⚠️ PROBLEMA**: Tiene logs de debug (console.log) que deberían eliminarse.

---

### 2. Auth Controller (`controllers/authController.js`)

#### `authentication` (login)
**Descripción**: Autentica usuario y genera JWT.

**Body**:
```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

**Proceso**:
1. Busca usuario por email
2. Verifica contraseña con bcrypt
3. Actualiza última sesión
4. Genera JWT
5. Configura cookie httpOnly

**Cookie Config**:
- `httpOnly`: true
- `sameSite`: 'None' (producción) / 'Lax' (desarrollo)
- `secure`: true en producción
- `domain`: '.bienesraices-s.onrender.com' en producción

**Respuesta**:
```json
{
  "message": "Inicio de sesión exitoso",
  "token": "eyJhbG...",
  "user": {
    "id": 1,
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan@example.com",
    "avatarUrl": null,
    "type_user": "buyer",
    "verified": true
  }
}
```

**Errores**:
- 401: Credenciales inválidas
- 500: Error del servidor

---

#### `verifyAuth`
**Descripción**: Verifica si el usuario está autenticado.

**Fuente del Token**: Cookie `_token`

**Respuesta**:
```json
{
  "authenticated": true,
  "user": {
    "sub": 1,
    "name": "Juan"
  }
}
```

**Errores**:
- 401: No autenticado o token inválido

---

#### `cerrarSesion`
**Descripción**: Cierra sesión eliminando la cookie.

**Proceso**: Limpia cookie `_token` con las mismas opciones que al crearla.

**Respuesta**:
```json
{
  "message": "Sesión cerrada exitosamente"
}
```

---

#### `registrarUsuario`
**Descripción**: Registra un nuevo usuario.

**Body**:
```json
{
  "firstname": "Juan",
  "lastName": "Pérez",
  "email": "juan@example.com",
  "password": "Password123",
  "phone": "123456789",
  "usertype": "buyer"
}
```

**Proceso**:
1. Valida campos requeridos
2. Verifica que email no exista
3. Crea usuario (password se hashea automáticamente)
4. Genera token de verificación
5. Envía email de verificación

**⚠️ PROBLEMA**: En línea 198, usa `user_type` pero el modelo espera `userType`.

**Respuesta**:
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "usuario": {
    "id": 1,
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan@example.com",
    "user_type": "buyer",
    "verified": false
  }
}
```

**Errores**:
- 400: Email ya registrado, validación fallida
- 500: Error del servidor

---

#### `verifyEmail`
**Descripción**: Verifica el email del usuario.

**Parámetros**: `token` (verification token)

**Proceso**:
1. Busca usuario por token
2. Verifica que no haya expirado
3. Marca como verificado y activo
4. Elimina token

**Respuesta**:
```json
{
  "success": true,
  "message": "Cuenta verificada correctamente"
}
```

**Errores**:
- 400: Token inválido o expirado

---

#### `recoverPassword`
**Descripción**: Inicia proceso de recuperación de contraseña.

**Body**:
```json
{
  "email": "user@example.com"
}
```

**Proceso**:
1. Busca usuario por email
2. Genera token de recuperación (JWT)
3. Guarda token y expiración (1 hora)
4. Envía email con enlace

**Respuesta**:
```json
{
  "message": "Se envió un email para recuperar la contraseña"
}
```

**Errores**:
- 400: Email requerido
- 404: Email no registrado

---

#### `verifyToken`
**Descripción**: Verifica validez del token de recuperación.

**Parámetros**: `token`

**Proceso**:
1. Busca usuario por recoveryToken
2. Verifica JWT
3. Verifica que no haya expirado

**Respuesta**:
```json
{
  "message": "Token válido, puede restablecer su contraseña"
}
```

**Errores**:
- 400: Token no proporcionado
- 404: Token no válido
- 401: Token expirado

---

#### `resetPassword`
**Descripción**: Restablece la contraseña.

**Body**:
```json
{
  "password": "NewPassword123"
}
```

**Parámetros**: `token`

**Proceso**:
1. Busca usuario por token
2. Verifica que no haya expirado
3. Verifica JWT
4. Actualiza contraseña (se hashea automáticamente)
5. Elimina token

**Respuesta**:
```json
{
  "message": "Contraseña actualizada exitosamente"
}
```

**Errores**:
- 400: Campos requeridos faltantes
- 404: Usuario no encontrado
- 401: Token inválido o expirado

---

### 3. Admin Controller (`controllers/adminController.js`)

#### `getMisPropiedades`
**Descripción**: Lista propiedades del usuario autenticado.

**Autenticación**: Requerida (JWT)

**Incluye**: PropertyImage (como 'foto')

**⚠️ PROBLEMA**:
- Usa `usuarioId` pero debería ser `userId`
- Usa alias 'foto' pero debería ser 'images'

**Respuesta**:
```json
{
  "propiedad": [...]
}
```

---

#### `crearPropiedad`
**Descripción**: Crea una nueva propiedad con imagen.

**Autenticación**: Requerida

**Multipart**: Requiere imagen (Multer)

**Proceso**:
1. Valida que haya imagen
2. Sube imagen a Cloudinary
3. Crea registro de PropertyImage
4. Crea Property

**Body**:
```json
{
  "titulo": "Casa moderna",
  "descripcion": "Hermosa casa...",
  "categoria": 1,
  "precio": 250000,
  "metros": 120,
  "ambientes": 3,
  "dormitorios": 2,
  "banos": 2,
  "cochera": 1,
  "calle": "Av. Principal 123",
  "lat": -34.603722,
  "lng": -58.381592
}
```

**⚠️ PROBLEMAS**:
- Usa campos que no existen en el modelo actual (titulo, metros, ambientes, banos, cochera, etc.)
- Debería usar: title, totalArea/coveredArea, bedrooms, bathrooms, garages
- Usa `categoriaId: 1` hardcoded
- Usa `usuarioId` en vez de `userId`
- Usa `fotoId` que no existe en el modelo

**Respuesta**:
```json
{
  "success": true,
  "mensaje": "Propiedad creada correctamente",
  "imagen": {...},
  "propiedad": {...}
}
```

---

#### `editarPropiedad`
**Descripción**: Obtiene propiedad para edición.

**Parámetros**: `id`

**⚠️ PROBLEMA**: Usa alias 'foto' en vez de 'images'.

---

#### `actualizarPropiedad`
**Descripción**: Actualiza una propiedad existente.

**Proceso**:
1. Busca propiedad
2. Si hay nueva imagen:
   - Sube a Cloudinary
   - Elimina imagen anterior de Cloudinary
   - Actualiza registro
3. Actualiza datos de propiedad

**⚠️ PROBLEMAS**:
- Mismos problemas de nombres de campos que en `crearPropiedad`
- Usa `fotoId` que no existe

---

#### `eliminarPropiedad`
**Descripción**: Elimina propiedad e imagen de Cloudinary.

**Proceso**:
1. Busca propiedad
2. Elimina imagen de Cloudinary (extrae public_id de URL)
3. Elimina registro de imagen
4. Elimina propiedad

**⚠️ PROBLEMA**: Usa `fotoId` que no existe.

---

#### `changePublish`
**Descripción**: Cambia estado de publicación.

**Body**:
```json
{
  "publicado": true
}
```

**⚠️ PROBLEMA**: El modelo Property no tiene campo `publicado`. Debería usar `active`.

---

## Middleware

### 1. `authMiddleware.js`

**Descripción**: Verifica autenticación del usuario.

**Fuentes del Token**:
1. Cookie `_token`
2. Header `Authorization: Bearer <token>`

**Proceso**:
1. Extrae token
2. Verifica con JWT
3. Añade `req.user` con payload decodificado
4. Llama `next()`

**Errores**:
- 401: Token no encontrado o inválido

**⚠️ PROBLEMA**: Tiene console.logs de debug que deben eliminarse.

---

### 2. `errorHandler.js`

**Descripción**: Middleware centralizado de manejo de errores.

**Características**:
- Extrae status del error (default: 500)
- Loguea en consola
- En desarrollo muestra stack trace

**Respuesta**:
```json
{
  "success": false,
  "message": "Error mensaje",
  "stack": "..." // Solo en desarrollo
}
```

**Función auxiliar**: `asyncHandler(fn)` - Envuelve funciones async para capturar errores.

---

### 3. `identifyUser.js`

**Descripción**: Identifica usuario sin requerir autenticación.

**Proceso**:
1. Busca cookie `_token`
2. Si no hay, `req.user = null` y continúa
3. Si hay, verifica JWT y busca usuario
4. Si es inválido, redirige a login

**⚠️ PROBLEMAS**:
- Importa `Usuario` que no existe (debería ser `User`)
- Usa redirects que no funcionan en API REST
- No está siendo usado en ninguna ruta

---

### 4. `validation.js`

**Descripción**: Validaciones con express-validator.

#### Validaciones de Autenticación

**`validateRegister`**:
- `firstname`: mínimo 2 caracteres
- `email`: email válido
- `password`: mínimo 8 caracteres, 1 mayúscula, 1 número

**`validateLogin`**:
- `email`: email válido
- `password`: no vacío

**`validateRecoverPassword`**:
- `email`: email válido

**`validateResetPassword`**:
- `password`: mismos requisitos que registro

#### Validaciones de Propiedades

**`validateCreatePropiedad`**:
- `titulo`: 5-100 caracteres
- `descripcion`: mínimo 10 caracteres
- `precio`: numérico
- `metros`: entero > 0
- `ambientes`: entero > 0
- `dormitorios`: entero ≥ 0
- `banos`: entero ≥ 0
- `cochera`: entero ≥ 0
- `calle`: requerido
- `lat`: -90 a 90
- `lng`: -180 a 180

**⚠️ PROBLEMA**: Valida campos que no coinciden con el modelo Property actual.

#### Validaciones de Parámetros

**`validateUUID`**: Valida que `id` sea UUID

**`validateCategoryId`**: Valida que `id` sea entero

**`validateSearchQuery`**: Valida query de búsqueda (1-100 caracteres)

---

## Helpers y Utilidades

### 1. `helpers/email.js`

#### `emailTokenRegister()`
**Descripción**: Genera token de verificación de email.

**Retorna**:
```javascript
{
  token: "hex_string_64_chars",
  expiration: Date (1 hora desde ahora)
}
```

**Usa**: `crypto.randomBytes(32).toString('hex')`

---

### 2. `helpers/logger.js`

**Descripción**: Logger estructurado con niveles.

**Niveles**:
- `ERROR`: Errores críticos
- `WARN`: Advertencias
- `INFO`: Información general
- `DEBUG`: Solo en desarrollo

**Uso**:
```javascript
logger.info('Servidor iniciado', { url: 'http://localhost:1234' })
logger.error('Error en BD', { error: error.message })
```

**Formato**:
```
[2024-01-15T10:30:00.000Z] [INFO] Mensaje {"key": "value"}
```

---

### 3. `helpers/recoveryPasswordToken.js`

#### `generarId()`
**Descripción**: Genera ID aleatorio de 32 caracteres hex.

#### `generateToken(user)`
**Descripción**: Genera JWT para el usuario.

**Payload**:
```javascript
{
  sub: user.id,
  name: user.firstName || user.first_name || user.email
}
```

**Opciones**:
- Algoritmo: HS256
- Expiración: 1 hora

**Valida**: Que JWT_SECRET exista en env

---

## Servicios

### `services/email.js`

Servicio de envío de emails con Nodemailer.

#### `sendRecoveryEmail(email, recoveryToken)`
**Descripción**: Envía email de recuperación de contraseña.

**Contenido**:
- Enlace: `${FRONTEND_URL}/auth/reset-password/${token}`
- Template HTML básico

**Configuración**:
- Host: Mailtrap (desarrollo)
- Puerto: 2525
- Secure: false

---

#### `sendVerificationEmail(email, token)`
**Descripción**: Envía email de verificación de cuenta.

**Contenido**:
- Enlace: `${BACKEND_URL}/auth/verify/${token}`
- Template HTML básico

---

## Recomendaciones y Correcciones

### 🔴 CRÍTICAS (Debe corregirse inmediatamente)

#### 1. **Inconsistencia en nombres de modelos**
**Archivo**: `config/passport.js:22`, `middleware/identifyUser.js:2`

**Problema**: Importa `Usuario` pero el modelo se llama `User`.

**Solución**:
```javascript
// En passport.js línea 3 y 22
import { User } from '../models/index.js'
const usuario = await User.scope('hideInfo').findByPk(jwtPayload.sub)

// En identifyUser.js línea 2 y 18
import { User } from '../models/User.js'
const usuario = await User.scope('hideInfo').findByPk(decoded.sub)
```

---

#### 2. **Desalineación entre controladores y modelo Property**
**Archivos**: `controllers/adminController.js`

**Problema**: Los controladores usan nombres de campos que no existen en el modelo actual:
- `titulo` → debería ser `title`
- `metros` → debería ser `totalArea` o `coveredArea`
- `ambientes` → no existe en el modelo
- `banos` → debería ser `bathrooms`
- `cochera` → debería ser `garages`
- `usuarioId` → debería ser `userId`
- `fotoId` → no existe en el modelo
- `publicado` → debería ser `active`

**Solución**:
Opción A: Actualizar controladores para usar los nombres correctos del modelo.
Opción B: Modificar el modelo para que coincida con los controladores (menos recomendado).

**Ejemplo de corrección en `crearPropiedad`**:
```javascript
const nuevaPropiedad = {
  userId: id,           // antes: usuarioId
  title: titulo,        // antes: titulo
  description: descripcion,
  propertyType: propertyType,  // nuevo campo requerido
  operationType: operationType, // nuevo campo requerido
  price: precio,
  totalArea: metros,
  bedrooms: dormitorios,
  bathrooms: banos,     // antes: banos
  garages: cochera,     // antes: cochera
  address: calle,       // antes: calle
  latitude: lat,
  longitude: lng
}
```

---

#### 3. **Validaciones desactualizadas**
**Archivo**: `middleware/validation.js`

**Problema**: `validateCreatePropiedad` valida campos que no existen en el modelo.

**Solución**: Actualizar validaciones:
```javascript
export const validateCreatePropiedad = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('El título es requerido')
    .isLength({ min: 5, max: 255 })
    .withMessage('El título debe tener entre 5 y 255 caracteres'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('La descripción es requerida'),
  body('propertyType')
    .isIn(['house', 'apartment', 'land', 'commercial', 'office', 'warehouse'])
    .withMessage('Tipo de propiedad inválido'),
  body('operationType')
    .isIn(['sale', 'rent', 'temporary'])
    .withMessage('Tipo de operación inválido'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('El precio debe ser un número positivo'),
  // ... continuar con campos correctos
]
```

---

#### 4. **Categoría no funcional**
**Problema**: El modelo `Categoria` existe pero no está relacionado con `Property`. Las búsquedas por categoría no funcionan.

**Soluciones**:
1. **Eliminar** el modelo Categoria y usar solo `propertyType` del modelo Property
2. **Migrar** la BD para agregar columna `categoriaId` a la tabla properties
3. **Documentar** claramente que se usa `propertyType` en lugar de categorías

**Recomendación**: Opción 1 - Eliminar Categoria y usar solo propertyType.

---

### 🟡 IMPORTANTES (Debe corregirse pronto)

#### 5. **Logs de debug en producción**
**Archivos**: Múltiples controladores

**Problema**: `console.log` en código de producción.

**Solución**: Usar el logger:
```javascript
// Antes
console.log('CACACACA')
console.log(req.params)

// Después
logger.debug('Verificando email', { params: req.params })
```

---

#### 6. **Validación UUID incorrecta**
**Archivo**: `middleware/validation.js:122`

**Problema**: Valida UUID pero Property usa INTEGER como ID.

**Solución**:
```javascript
export const validatePropertyId = [
  param('id')
    .isInt()
    .withMessage('ID inválido')
]
```

---

#### 7. **Middleware identifyUser no utilizado**
**Problema**: El archivo existe pero no se usa en ninguna ruta y tiene imports incorrectos.

**Solución**: Eliminar el archivo o corregirlo y usarlo donde corresponda.

---

#### 8. **Falta validación de ownership**
**Archivos**: `controllers/adminController.js`

**Problema**: No verifica que el usuario sea dueño de la propiedad antes de editarla/eliminarla.

**Solución**: Agregar verificación:
```javascript
export const editarPropiedad = async (req, res) => {
  const { id } = req.params
  const { sub: userId } = req.user

  const propiedad = await Property.findByPk(id)

  if (!propiedad) {
    return res.status(404).json({ message: 'Propiedad no encontrada' })
  }

  // Verificar ownership
  if (propiedad.userId !== userId) {
    return res.status(403).json({ message: 'No autorizado' })
  }

  // Continuar...
}
```

---

### 🟢 RECOMENDACIONES (Mejoras opcionales)

#### 9. **Implementar paginación**
**Problema**: `/propiedades` puede devolver miles de registros.

**Solución**:
```javascript
export const getAllPropiedades = async (req, res) => {
  const { limit = 10, offset = 0 } = req.query

  const { count, rows } = await Property.findAndCountAll({
    limit: parseInt(limit),
    offset: parseInt(offset),
    include: [PropertyImage, User],
    order: [['createdAt', 'DESC']]
  })

  res.json({
    total: count,
    page: Math.floor(offset / limit) + 1,
    totalPages: Math.ceil(count / limit),
    propiedades: rows
  })
}
```

---

#### 10. **Caché de imágenes**
**Problema**: Cada request consulta Cloudinary URLs.

**Solución**: Usar el campo `mainImageUrl` de Property más efectivamente.

---

#### 11. **Tests unitarios**
**Problema**: No hay tests.

**Solución**: Implementar con Jest/Mocha:
- Tests de modelos
- Tests de controladores
- Tests de autenticación
- Tests de integración

---

#### 12. **Documentación de API con Swagger**
**Solución**: Agregar Swagger/OpenAPI:
```bash
npm install swagger-ui-express swagger-jsdoc
```

---

#### 13. **Migraciones de base de datos**
**Problema**: No hay sistema de migraciones.

**Solución**: Usar Sequelize CLI:
```bash
npm install --save-dev sequelize-cli
npx sequelize-cli init
```

---

#### 14. **Validación de imágenes**
**Problema**: No valida tipo ni tamaño de imagen.

**Solución**:
```javascript
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Solo se permiten imágenes'))
    }
  }
})
```

---

#### 15. **Soft delete en User**
**Problema**: User no tiene soft delete pero Property sí.

**Solución**: Agregar `paranoid: true` al modelo User.

---

#### 16. **Rate limiting por endpoint**
**Problema**: Solo auth tiene rate limiting específico.

**Solución**: Agregar a endpoints críticos:
- POST /admin/mis-propiedades/crear-propiedad
- DELETE /admin/mis-propiedades/eliminar/:id
- POST /buscar

---

#### 17. **Webhooks de Cloudinary**
**Problema**: Si falla la eliminación de Cloudinary, la imagen queda huérfana.

**Solución**: Implementar job queue para reintentos.

---

#### 18. **CORS más restrictivo**
**Problema**: Permite cualquier origin sin origin.

**Solución**:
```javascript
origin: (origin, callback) => {
  const whitelist = [frontendUrl, 'http://localhost:3000']

  if (!origin && process.env.NODE_ENV === 'development') {
    return callback(null, true)
  }

  if (whitelist.includes(origin?.replace(/\/+$/, ''))) {
    callback(null, true)
  } else {
    callback(new Error('CORS no permitido'))
  }
}
```

---

#### 19. **Variables de entorno más seguras**
**Problema**: JWT_SECRET podría ser débil.

**Solución**: Validar al inicio:
```javascript
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET debe tener al menos 32 caracteres')
}
```

---

#### 20. **Sanitización de HTML**
**Problema**: `description` podría tener XSS.

**Solución**:
```bash
npm install xss
```

```javascript
import xss from 'xss'

const nuevaPropiedad = {
  description: xss(descripcion)
}
```

---

## Resumen de Estado del Proyecto

### ✅ Fortalezas
- Buena estructura de carpetas
- Uso de Sequelize ORM
- Autenticación JWT robusta
- Rate limiting implementado
- Validaciones con express-validator
- Logger estructurado
- Integración con Cloudinary
- Scopes y hooks en modelos
- Soft delete en Property

### ❌ Problemas Críticos
1. Imports de modelos incorrectos
2. Desalineación total entre controladores y modelo Property
3. Validaciones obsoletas
4. Modelo Categoria no funcional

### ⚠️ Problemas Importantes
5. Logs de debug en código
6. Validación UUID incorrecta
7. Middleware no utilizado
8. Falta validación de ownership

### 💡 Mejoras Sugeridas
9. Paginación
10. Caché optimizado
11. Tests unitarios
12. Documentación Swagger
13. Sistema de migraciones
14. Validación de imágenes
15-20. Otras mejoras de seguridad y performance

---

## Prioridades de Corrección

### Sprint 1 (Crítico - Esta semana)
1. ✅ Corregir imports de modelos (Usuario → User)
2. ✅ Alinear controladores con modelo Property
3. ✅ Actualizar validaciones
4. ✅ Decidir qué hacer con Categoria

### Sprint 2 (Importante - Próxima semana)
5. ✅ Eliminar console.logs
6. ✅ Corregir validación de IDs
7. ✅ Agregar validación de ownership
8. ✅ Implementar paginación

### Sprint 3 (Mejoras - Siguiente mes)
9. ✅ Tests unitarios
10. ✅ Documentación Swagger
11. ✅ Migraciones
12. ✅ Validaciones de imágenes

---

## Comandos Útiles

```bash
# Desarrollo
npm start

# Importar datos de prueba
npm run db:importar

# Eliminar datos de prueba
npm run db:eliminar

# Linter (si se configura)
npm run lint
```

---

## Contacto y Soporte

Para dudas sobre esta documentación o el proyecto, contactar al equipo de desarrollo.

**Versión**: 1.0.0
**Fecha**: 2026-02-02
**Autor**: Claude Code
