# Plan de Migración a Monorepo - Bienes Raíces (PERSONALIZADO)

**Configuración Seleccionada:**
- ✅ npm workspaces
- ✅ TypeScript solo en shared packages
- ✅ Estructura estándar (apps/, packages/)
- ✅ MySQL en producción
- ✅ Deploy: Vercel (frontend) + Railway (backend)
- ✅ Shared packages: types, validadores, constantes, formatters, eslint

**Tiempo estimado total:** 2.5 horas

---

## 📋 Índice
1. [Estructura Final](#estructura-final)
2. [Paso a Paso (Ejecutable)](#paso-a-paso-ejecutable)
3. [Shared Packages Específicos](#shared-packages-específicos)
4. [Scripts de Desarrollo](#scripts-de-desarrollo)
5. [Deployment](#deployment)
6. [Testing](#testing)
7. [Checklist Final](#checklist-final)

---

## 🏗️ Estructura Final

```
02-bienesraices-react/
├── apps/
│   ├── frontend/              # Tu carpeta "front" actual
│   │   ├── src/
│   │   ├── public/
│   │   ├── package.json       # Con @bienesraices/frontend
│   │   ├── vite.config.js
│   │   └── vitest.config.js
│   │
│   └── backend/               # Tu carpeta "back" actual
│       ├── controllers/
│       ├── models/
│       ├── router/
│       ├── services/
│       ├── config/
│       ├── package.json       # Con @bienesraices/backend
│       └── server.js
│
├── packages/
│   ├── shared-types/          # TypeScript - interfaces API
│   │   ├── src/
│   │   │   ├── property.ts
│   │   │   ├── user.ts
│   │   │   ├── auth.ts
│   │   │   ├── categoria.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── shared-utils/          # JavaScript - utilidades
│   │   ├── src/
│   │   │   ├── validation.js
│   │   │   ├── formatters.js
│   │   │   ├── constants.js
│   │   │   └── index.js
│   │   └── package.json
│   │
│   └── eslint-config/         # Config compartida
│       ├── index.js
│       └── package.json
│
├── docs/                      # Ya tienes esto
├── screenshots/               # Ya tienes esto
│
├── package.json               # ROOT - npm workspaces
├── .gitignore                 # Actualizado
├── README.md                  # Actualizado con nuevos comandos
└── MONOREPO_SETUP_PERSONALIZADO.md  # Este documento
```

---

## 🚀 Paso a Paso (Ejecutable)

### Fase 1: Preparación (5 minutos)

#### 1.1 Hacer backup
```bash
cd ~/Desktop/proyectos/02-bienesraices-react

# Crear backup por si acaso
tar -czf ../backup-bienesraices-$(date +%Y%m%d).tar.gz .

# Verificar git está limpio
git status
# Si hay cambios sin commitear, hazlo ahora
```

#### 1.2 Crear estructura de directorios
```bash
# Crear directorios principales
mkdir -p apps packages

# Mover carpetas existentes
mv front apps/frontend
mv back apps/backend

# Verificar que se movieron correctamente
ls -la apps/
```

---

### Fase 2: Configurar Workspace Root (10 minutos)

#### 2.1 Crear package.json root

**Ruta:** `package.json` (en la raíz del proyecto)

```json
{
  "name": "bienesraices-monorepo",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "concurrently -n \"frontend,backend\" -c \"cyan,green\" \"npm run dev -w @bienesraices/frontend\" \"npm run dev -w @bienesraices/backend\"",
    "dev:frontend": "npm run dev -w @bienesraices/frontend",
    "dev:backend": "npm run dev -w @bienesraices/backend",
    "build": "npm run build --workspaces --if-present",
    "build:frontend": "npm run build -w @bienesraices/frontend",
    "test": "npm run test --workspaces --if-present",
    "test:frontend": "npm run test -w @bienesraices/frontend",
    "lint": "npm run lint --workspaces --if-present",
    "clean": "rm -rf node_modules apps/*/node_modules packages/*/node_modules",
    "install:all": "npm install",
    "typecheck": "tsc --noEmit -p packages/shared-types/tsconfig.json"
  },
  "devDependencies": {
    "concurrently": "^8.2.2",
    "typescript": "^5.3.3"
  }
}
```

#### 2.2 Instalar dependencias del root
```bash
npm install
```

---

### Fase 3: Actualizar Frontend (15 minutos)

#### 3.1 Actualizar package.json del frontend

**Ruta:** `apps/frontend/package.json`

Cambiar:
```json
{
  "name": "@bienesraices/frontend",
  "private": true,
  "version": "1.0.0"
}
```

Agregar dependencias de workspace (al final de dependencies):
```json
{
  "dependencies": {
    // ... tus dependencias actuales ...
    "@bienesraices/shared-types": "workspace:*",
    "@bienesraices/shared-utils": "workspace:*"
  }
}
```

#### 3.2 Actualizar vite.config.js

**Ruta:** `apps/frontend/vite.config.js`

Agregar alias para los packages:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@features': path.resolve(__dirname, './src/features'),
      '@components': path.resolve(__dirname, './src/components'),
      '@bienesraices/shared-types': path.resolve(__dirname, '../../packages/shared-types/src'),
      '@bienesraices/shared-utils': path.resolve(__dirname, '../../packages/shared-utils/src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
})
```

---

### Fase 4: Actualizar Backend (15 minutos)

#### 4.1 Actualizar package.json del backend

**Ruta:** `apps/backend/package.json`

Cambiar:
```json
{
  "name": "@bienesraices/backend",
  "private": true,
  "version": "1.0.0",
  "type": "module"
}
```

Agregar dependencias de workspace:
```json
{
  "dependencies": {
    // ... tus dependencias actuales ...
    "@bienesraices/shared-types": "workspace:*",
    "@bienesraices/shared-utils": "workspace:*"
  },
  "devDependencies": {
    // ... tus devDependencies actuales ...
    "nodemon": "^3.0.2"
  }
}
```

#### 4.2 Agregar script de desarrollo con nodemon

Actualizar scripts en `apps/backend/package.json`:
```json
{
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js",
    "test": "echo \"Error: no test specified\" && exit 1",
    "db:importar": "node ./seed/seeder.js -i",
    "db:eliminar": "node ./seed/seeder.js -e"
  }
}
```

#### 4.3 Crear nodemon.json

**Ruta:** `apps/backend/nodemon.json`

```json
{
  "watch": [
    ".",
    "../../packages/shared-types/src",
    "../../packages/shared-utils/src"
  ],
  "ext": "js,json,ts",
  "ignore": [
    "node_modules",
    "*.test.js"
  ],
  "exec": "node server.js"
}
```

---

### Fase 5: Crear Shared Packages (45 minutos)

#### 5.1 Crear shared-types (TypeScript)

**A. Crear package.json**

**Ruta:** `packages/shared-types/package.json`

```json
{
  "name": "@bienesraices/shared-types",
  "version": "1.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./property": "./src/property.ts",
    "./user": "./src/user.ts",
    "./auth": "./src/auth.ts"
  }
}
```

**B. Crear tsconfig.json**

**Ruta:** `packages/shared-types/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "noEmit": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

**C. Crear interfaces**

**Ruta:** `packages/shared-types/src/property.ts`

```typescript
export interface Property {
  id: string;
  titulo: string;
  descripcion: string;
  precio: number;
  habitaciones: number;
  estacionamiento: number;
  wc: number;
  imagen: string | null;
  categoriaId: number;
  precioId: number;
  usuarioId: string;
  lat: string | null;
  lng: string | null;
  publicado: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PropertyCreateDTO {
  titulo: string;
  descripcion: string;
  precio: number;
  habitaciones: number;
  estacionamiento: number;
  wc: number;
  categoriaId: number;
  precioId: number;
  lat?: string;
  lng?: string;
}

export interface PropertyUpdateDTO extends Partial<PropertyCreateDTO> {}

export interface PropertyFilterParams {
  categoriaId?: number;
  precioId?: number;
  habitaciones?: number;
  estacionamiento?: number;
  wc?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PropertyResponse {
  property: Property;
}

export interface PropertiesListResponse {
  properties: Property[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

**Ruta:** `packages/shared-types/src/user.ts`

```typescript
export interface User {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  confirmado: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRegisterDTO {
  nombre: string;
  email: string;
  password: string;
  repetir_password: string;
}

export interface UserLoginDTO {
  email: string;
  password: string;
}

export interface UserUpdateDTO {
  nombre?: string;
  telefono?: string;
}
```

**Ruta:** `packages/shared-types/src/auth.ts`

```typescript
import { User } from './user';

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}

export interface AuthError {
  message: string;
  code: 'INVALID_CREDENTIALS' | 'USER_EXISTS' | 'INVALID_TOKEN' | 'UNAUTHORIZED' | 'EMAIL_NOT_CONFIRMED';
  details?: Record<string, string>;
}

export interface TokenPayload {
  id: string;
  email: string;
  nombre: string;
}
```

**Ruta:** `packages/shared-types/src/categoria.ts`

```typescript
export interface Categoria {
  id: number;
  nombre: string;
}

export interface Precio {
  id: number;
  nombre: string;
}
```

**Ruta:** `packages/shared-types/src/index.ts`

```typescript
// Property types
export * from './property';

// User types
export * from './user';

// Auth types
export * from './auth';

// Categoria types
export * from './categoria';
```

---

#### 5.2 Crear shared-utils (JavaScript)

**A. Crear package.json**

**Ruta:** `packages/shared-utils/package.json`

```json
{
  "name": "@bienesraices/shared-utils",
  "version": "1.0.0",
  "private": true,
  "main": "./src/index.js",
  "type": "module",
  "exports": {
    ".": "./src/index.js",
    "./validation": "./src/validation.js",
    "./formatters": "./src/formatters.js",
    "./constants": "./src/constants.js"
  }
}
```

**B. Crear archivos**

**Ruta:** `packages/shared-utils/src/validation.js`

```javascript
/**
 * Valida formato de email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida que el precio sea un número positivo
 */
export const isValidPrice = (price) => {
  const numPrice = Number(price);
  return !isNaN(numPrice) && numPrice > 0;
};

/**
 * Valida número de habitaciones (0-10)
 */
export const isValidRooms = (rooms) => {
  const numRooms = Number(rooms);
  return Number.isInteger(numRooms) && numRooms >= 0 && numRooms <= 10;
};

/**
 * Valida número de estacionamientos (0-10)
 */
export const isValidParking = (parking) => {
  const numParking = Number(parking);
  return Number.isInteger(numParking) && numParking >= 0 && numParking <= 10;
};

/**
 * Valida número de baños (0-10)
 */
export const isValidBathrooms = (bathrooms) => {
  const numBathrooms = Number(bathrooms);
  return Number.isInteger(numBathrooms) && numBathrooms >= 0 && numBathrooms <= 10;
};

/**
 * Evalúa fortaleza de contraseña
 * @returns {'weak' | 'medium' | 'strong'}
 */
export const passwordStrength = (password) => {
  if (!password || password.length < 6) return 'weak';
  if (password.length < 10) return 'medium';
  if (password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
    return 'strong';
  }
  return 'medium';
};

/**
 * Valida longitud mínima de contraseña
 */
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

/**
 * Valida que dos contraseñas coincidan
 */
export const passwordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

/**
 * Valida coordenadas de latitud
 */
export const isValidLatitude = (lat) => {
  const numLat = Number(lat);
  return !isNaN(numLat) && numLat >= -90 && numLat <= 90;
};

/**
 * Valida coordenadas de longitud
 */
export const isValidLongitude = (lng) => {
  const numLng = Number(lng);
  return !isNaN(numLng) && numLng >= -180 && numLng <= 180;
};
```

**Ruta:** `packages/shared-utils/src/formatters.js`

```javascript
/**
 * Formatea precio en pesos argentinos
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Formatea fecha en formato legible español
 */
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

/**
 * Formatea fecha en formato corto
 */
export const formatDateShort = (date) => {
  return new Intl.DateTimeFormat('es-AR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(date));
};

/**
 * Trunca texto a longitud máxima
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Capitaliza primera letra
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Formatea número de habitaciones/baños para mostrar
 */
export const formatRoomCount = (count, singular, plural) => {
  if (count === 0) return `Sin ${plural}`;
  if (count === 1) return `1 ${singular}`;
  return `${count} ${plural}`;
};
```

**Ruta:** `packages/shared-utils/src/constants.js`

```javascript
/**
 * Versión de la API
 */
export const API_VERSION = 'v1';

/**
 * Estados de una propiedad
 */
export const PROPERTY_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  SOLD: 'sold',
  ARCHIVED: 'archived',
};

/**
 * Roles de usuario
 */
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
};

/**
 * Configuración de paginación
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

/**
 * Mensajes de error estándar
 */
export const ERROR_MESSAGES = {
  // Auth
  UNAUTHORIZED: 'No autorizado',
  INVALID_CREDENTIALS: 'Credenciales inválidas',
  USER_EXISTS: 'El usuario ya existe',
  EMAIL_NOT_CONFIRMED: 'Debes confirmar tu email primero',
  INVALID_TOKEN: 'Token inválido o expirado',

  // General
  NOT_FOUND: 'Recurso no encontrado',
  SERVER_ERROR: 'Error del servidor',
  VALIDATION_ERROR: 'Error de validación',

  // Property
  PROPERTY_NOT_FOUND: 'Propiedad no encontrada',
  PROPERTY_ALREADY_PUBLISHED: 'La propiedad ya está publicada',
  NOT_PROPERTY_OWNER: 'No eres el propietario de esta propiedad',

  // File upload
  FILE_TOO_LARGE: 'El archivo es demasiado grande',
  INVALID_FILE_TYPE: 'Tipo de archivo no válido',
};

/**
 * Códigos de error
 */
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  SERVER_ERROR: 'SERVER_ERROR',
};

/**
 * Límites de archivos
 */
export const FILE_LIMITS = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
};

/**
 * Configuración de JWT
 */
export const JWT_CONFIG = {
  EXPIRES_IN: '30d',
  COOKIE_MAX_AGE: 30 * 24 * 60 * 60 * 1000, // 30 días en ms
};
```

**Ruta:** `packages/shared-utils/src/index.js`

```javascript
// Validation
export * from './validation.js';

// Formatters
export * from './formatters.js';

// Constants
export * from './constants.js';
```

---

#### 5.3 Crear eslint-config

**Ruta:** `packages/eslint-config/package.json`

```json
{
  "name": "@bienesraices/eslint-config",
  "version": "1.0.0",
  "private": true,
  "main": "index.js"
}
```

**Ruta:** `packages/eslint-config/index.js`

```javascript
module.exports = {
  extends: ['standard'],
  env: {
    node: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
    'space-before-function-paren': ['error', {
      anonymous: 'always',
      named: 'never',
      asyncArrow: 'always',
    }],
  },
};
```

---

### Fase 6: Instalar Workspaces (5 minutos)

```bash
# Desde la raíz del proyecto
cd ~/Desktop/proyectos/02-bienesraices-react

# Limpiar node_modules antiguos
npm run clean

# Instalar todo con workspaces
npm install

# Verificar que los workspaces se instalaron correctamente
npm list --depth=0 -w
```

---

### Fase 7: Actualizar Imports (30 minutos)

#### 7.1 Ejemplo: Actualizar frontend

**Ejemplo en el archivo de API**

**Archivo:** `apps/frontend/src/api/auth.js`

**Antes:**
```javascript
const API_URL = 'http://localhost:4000/api/auth';

export const login = async (email, password) => {
  // ...
};
```

**Después:**
```javascript
// @ts-check
import { ERROR_MESSAGES } from '@bienesraices/shared-utils/constants';
/** @type {import('@bienesraices/shared-types').UserLoginDTO} */

const API_URL = 'http://localhost:4000/api/auth';

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    /** @type {import('@bienesraices/shared-types').AuthResponse} */
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};
```

#### 7.2 Ejemplo: Actualizar backend

**Archivo:** `apps/backend/controllers/usuarioController.js`

**Antes:**
```javascript
const formularioLogin = async (req, res) => {
  const { email, password } = req.body;
  // ...
};
```

**Después:**
```javascript
import { isValidEmail, isValidPassword } from '@bienesraices/shared-utils/validation';
import { ERROR_MESSAGES } from '@bienesraices/shared-utils/constants';

const formularioLogin = async (req, res) => {
  const { email, password } = req.body;

  // Validación con shared-utils
  if (!isValidEmail(email)) {
    return res.status(400).json({
      message: 'Email inválido',
    });
  }

  if (!isValidPassword(password)) {
    return res.status(400).json({
      message: ERROR_MESSAGES.INVALID_CREDENTIALS,
    });
  }

  // ... resto del código
};
```

---

### Fase 8: Actualizar .gitignore (2 minutos)

**Ruta:** `.gitignore` (raíz del proyecto)

```gitignore
# Dependencies
node_modules/
apps/*/node_modules/
packages/*/node_modules/

# Environment files
.env
.env.local
.env.*.local
apps/*/.env
apps/*/.env.local

# Build outputs
dist/
build/
apps/*/dist/
apps/*/build/

# Logs
logs/
*.log
npm-debug.log*

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Test coverage
coverage/
apps/*/coverage/

# Temporary files
*.tmp
.cache/

# TypeScript
*.tsbuildinfo

# Uploads (backend)
apps/backend/public/uploads/
```

---

## 📝 Scripts de Desarrollo

### Comandos que usarás a diario:

```bash
# Desarrollo (ambos servidores simultáneamente)
npm run dev

# Solo frontend
npm run dev:frontend

# Solo backend
npm run dev:backend

# Build de producción
npm run build
npm run build:frontend

# Tests
npm run test
npm run test:frontend

# Lint
npm run lint

# Type checking (TypeScript)
npm run typecheck

# Limpiar e instalar de cero
npm run clean
npm install
```

### Agregar dependencias:

```bash
# A frontend
npm install axios -w @bienesraices/frontend

# A backend
npm install express-session -w @bienesraices/backend

# A la raíz (herramientas de desarrollo)
npm install -D prettier
```

---

## 🚀 Deployment

### Frontend en Vercel

**1. Conectar repositorio a Vercel:**
- Ve a [vercel.com](https://vercel.com)
- Importa tu repositorio de GitHub
- Configura el proyecto

**2. Configuración del proyecto:**

**Framework Preset:** Vite
**Root Directory:** `apps/frontend`
**Build Command:** `npm run build -w @bienesraices/frontend`
**Output Directory:** `apps/frontend/dist`
**Install Command:** `npm install`

**3. Variables de entorno:**
```
VITE_API_URL=https://tu-backend.railway.app/api
```

**4. Deploy:**
- Vercel detecta cambios en `main` y deploya automáticamente
- Cada PR crea un preview deployment

---

### Backend en Railway

**1. Crear proyecto en Railway:**
- Ve a [railway.app](https://railway.app)
- New Project → Deploy from GitHub repo
- Selecciona tu repositorio

**2. Configuración del servicio:**

**Root Directory:** `apps/backend`
**Build Command:** (vacío, no hay build)
**Start Command:** `npm start -w @bienesraices/backend`

**3. Agregar MySQL:**
- Add Service → Database → MySQL
- Railway genera automáticamente las variables de entorno

**4. Variables de entorno:**
```
NODE_ENV=production
PORT=4000
DB_HOST=${{MySQL.MYSQLHOST}}
DB_USER=${{MySQL.MYSQLUSER}}
DB_PASS=${{MySQL.MYSQLPASSWORD}}
DB_NAME=${{MySQL.MYSQLDATABASE}}
DB_PORT=${{MySQL.MYSQLPORT}}
JWT_SECRET=tu-secreto-super-seguro-aqui
FRONTEND_URL=https://tu-app.vercel.app
```

**5. Deploy:**
- Railway deploya automáticamente en cada push a `main`

---

### Base de datos en Producción

**Opción 1: Railway MySQL (Recomendado)**
- Incluido gratis con tu backend
- Configuración automática
- Backups automáticos

**Opción 2: PlanetScale (MySQL Serverless)**
- Gratis hasta 10GB
- Escalabilidad automática
- Requiere configurar conexión

**Migración de datos:**
```bash
# Exportar DB local
mysqldump -u root -p bienesraices_desarrollo > dump.sql

# Importar a Railway (usa las credenciales de Railway)
mysql -h <RAILWAY_HOST> -u <RAILWAY_USER> -p <RAILWAY_DB> < dump.sql
```

---

## 🧪 Testing

### Frontend (Vitest ya configurado)

Los tests actuales seguirán funcionando, pero ahora puedes:

**Usar tipos compartidos en tests:**

```javascript
// apps/frontend/src/api/__tests__/auth.test.js
import { describe, it, expect } from 'vitest';
import { login } from '../auth';

describe('Auth API', () => {
  it('should return AuthResponse type', async () => {
    const response = await login('test@test.com', 'password');

    // TypeScript valida estructura
    expect(response).toHaveProperty('user');
    expect(response).toHaveProperty('token');
    expect(response.user).toHaveProperty('email');
  });
});
```

### Backend (Agregar Jest)

**Instalar Jest:**
```bash
npm install -D jest supertest -w @bienesraices/backend
```

**Configurar Jest:**

**Archivo:** `apps/backend/jest.config.js`

```javascript
export default {
  testEnvironment: 'node',
  transform: {},
  moduleNameMapper: {
    '^@bienesraices/shared-types$': '<rootDir>/../../packages/shared-types/src/index.ts',
    '^@bienesraices/shared-utils$': '<rootDir>/../../packages/shared-utils/src/index.js',
  },
};
```

**Ejemplo de test:**

```javascript
// apps/backend/__tests__/auth.test.js
import request from 'supertest';
import app from '../server.js';

describe('POST /api/auth/login', () => {
  it('should return 200 and token on valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user).toHaveProperty('email', 'test@example.com');
  });
});
```

---

## ✅ Checklist Final

### Estructura
- [ ] Carpetas `apps/` y `packages/` creadas
- [ ] `front/` movido a `apps/frontend/`
- [ ] `back/` movido a `apps/backend/`
- [ ] `packages/shared-types/` creado
- [ ] `packages/shared-utils/` creado
- [ ] `packages/eslint-config/` creado

### Configuración
- [ ] `package.json` root creado con workspaces
- [ ] `apps/frontend/package.json` actualizado con `@bienesraices/frontend`
- [ ] `apps/backend/package.json` actualizado con `@bienesraices/backend`
- [ ] `apps/frontend/vite.config.js` actualizado con alias
- [ ] `apps/backend/nodemon.json` creado
- [ ] `.gitignore` actualizado

### Instalación
- [ ] `npm run clean` ejecutado
- [ ] `npm install` ejecutado
- [ ] `npm list --depth=0 -w` muestra todos los workspaces

### Shared Packages
- [ ] TypeScript instalado globalmente
- [ ] `packages/shared-types/src/` tiene todas las interfaces
- [ ] `packages/shared-utils/src/` tiene validadores, formatters, constantes
- [ ] `npm run typecheck` pasa sin errores

### Imports Actualizados
- [ ] Frontend usa `@bienesraices/shared-types` en al menos 1 archivo
- [ ] Frontend usa `@bienesraices/shared-utils` en al menos 1 archivo
- [ ] Backend usa `@bienesraices/shared-utils` en validaciones
- [ ] No hay errores de importación

### Testing
- [ ] `npm run dev` levanta frontend y backend simultáneamente
- [ ] Frontend accede a `http://localhost:5173`
- [ ] Backend accede a `http://localhost:4000`
- [ ] Frontend se comunica con backend correctamente
- [ ] `npm run build:frontend` genera dist sin errores

### Git
- [ ] Todos los cambios commiteados
- [ ] README actualizado con nuevos comandos
- [ ] `.gitignore` excluye `node_modules` de todos los niveles

### Deployment (Opcional - después de desarrollo)
- [ ] Frontend deployado en Vercel
- [ ] Backend deployado en Railway
- [ ] MySQL configurado en Railway
- [ ] Variables de entorno configuradas
- [ ] App funciona en producción

---

## 🎉 ¡Felicitaciones!

Tu monorepo está listo. Ahora tienes:

✅ **Un solo repositorio** para frontend y backend
✅ **Código compartido** sin duplicación
✅ **Tipos validados** entre frontend y backend
✅ **Desarrollo simplificado** con `npm run dev`
✅ **Deploy independiente** de cada app
✅ **Escalabilidad** para agregar apps móviles

---

## 🆘 Troubleshooting

### Error: "Cannot find module '@bienesraices/shared-types'"

**Solución:**
```bash
# Limpiar e reinstalar
npm run clean
npm install

# Verificar workspaces
npm list --depth=0 -w
```

### Error: Frontend no se conecta al backend

**Verifica proxy en vite.config.js:**
```javascript
server: {
  proxy: {
    '/api': 'http://localhost:4000',  // Puerto del backend
  },
}
```

### Error: TypeScript no encuentra tipos

**Verifica alias en vite.config.js:**
```javascript
resolve: {
  alias: {
    '@bienesraices/shared-types': path.resolve(__dirname, '../../packages/shared-types/src'),
  },
}
```

### Error: Backend no arranca con nodemon

**Verifica que nodemon esté instalado:**
```bash
npm install -D nodemon -w @bienesraices/backend
```

---

**Fecha de creación:** 2026-02-09
**Versión:** 1.0 Personalizado
**Autor:** Claude Sonnet 4.5
