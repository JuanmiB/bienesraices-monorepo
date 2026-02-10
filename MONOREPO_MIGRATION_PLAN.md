# Plan de Migración a Monorepo - Bienes Raíces

## 📋 Tabla de Contenidos
1. [Estructura Recomendada](#estructura-recomendada)
2. [Ventajas del Monorepo](#ventajas-del-monorepo)
3. [Pasos de Migración](#pasos-de-migración)
4. [Configuración de Workspaces](#configuración-de-workspaces)
5. [Shared Packages](#shared-packages)
6. [Scripts y Comandos](#scripts-y-comandos)
7. [CI/CD](#cicd)
8. [Estrategia de Testing](#estrategia-de-testing)
9. [Despliegue](#despliegue)
10. [Checklist de Migración](#checklist-de-migración)

---

## 🏗️ Estructura Recomendada

```
bienesraices-monorepo/
├── apps/
│   ├── frontend/              # React + Vite app
│   │   ├── src/
│   │   ├── public/
│   │   ├── package.json
│   │   ├── vite.config.js
│   │   └── vitest.config.js
│   │
│   └── backend/               # Node.js + Express API
│       ├── src/
│       ├── tests/
│       ├── package.json
│       └── nodemon.json
│
├── packages/                  # Código compartido
│   ├── shared-types/          # TypeScript types/interfaces
│   │   ├── src/
│   │   │   ├── property.ts
│   │   │   ├── user.ts
│   │   │   ├── auth.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── shared-utils/          # Utilidades compartidas
│   │   ├── src/
│   │   │   ├── validation.js
│   │   │   ├── formatters.js
│   │   │   ├── constants.js
│   │   │   └── index.js
│   │   └── package.json
│   │
│   └── eslint-config/         # Configuración ESLint compartida
│       ├── index.js
│       └── package.json
│
├── docs/                      # Documentación del proyecto
│   ├── API.md
│   ├── ARCHITECTURE.md
│   └── CONTRIBUTING.md
│
├── scripts/                   # Scripts de utilidad
│   ├── migrate-db.js
│   ├── seed-data.js
│   └── clean-install.sh
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
│
├── package.json               # Root package.json con workspaces
├── pnpm-workspace.yaml        # Configuración de pnpm workspaces
├── turbo.json                 # Configuración de Turborepo (opcional)
├── .gitignore
├── .eslintrc.json
└── README.md
```

---

## ✅ Ventajas del Monorepo

### 1. **Código Compartido sin Duplicación**
- Types/interfaces compartidos entre frontend y backend
- Utilidades reutilizables (validadores, formatters, constantes)
- Configuraciones compartidas (ESLint, Prettier, TypeScript)

### 2. **Desarrollo Sincronizado**
- Cambios en el backend reflejados inmediatamente en el frontend
- No hay problemas de versiones desincronizadas
- Commits atómicos que afectan ambas apps simultáneamente

### 3. **Gestión Simplificada de Dependencias**
- Una sola instalación de dependencias comunes
- Versiones consistentes en todo el proyecto
- Menor tamaño total de node_modules

### 4. **Testing Integral**
- Tests end-to-end que prueban todo el stack
- CI/CD unificado que prueba frontend y backend juntos
- Validación de contratos API en ambos lados

### 5. **Refactoring más Seguro**
- Cambios en la API detectados inmediatamente
- Refactors que afectan múltiples paquetes en un solo PR
- TypeScript puede validar todo el stack

---

## 🚀 Pasos de Migración

### Fase 1: Preparación (30 min)

#### 1.1 Crear estructura del monorepo
```bash
# Crear directorio raíz del monorepo
cd ~/Desktop/proyectos
mkdir bienesraices-monorepo
cd bienesraices-monorepo

# Crear estructura de directorios
mkdir -p apps/frontend apps/backend packages docs scripts .github/workflows
```

#### 1.2 Inicializar Git
```bash
git init
git branch -M main
```

#### 1.3 Crear package.json raíz
```bash
npm init -y
```

### Fase 2: Migrar Frontend (1 hora)

#### 2.1 Copiar código del frontend
```bash
# Copiar todo el contenido de front/ a apps/frontend/
cp -r ../02-bienesraices-react/front/* apps/frontend/

# O hacer git subtree si quieres mantener historial
cd apps/frontend
git remote add frontend-origin <url-del-repo-frontend>
git fetch frontend-origin
git merge --allow-unrelated-histories frontend-origin/main
```

#### 2.2 Actualizar package.json del frontend
```json
{
  "name": "@bienesraices/frontend",
  "private": true,
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "@bienesraices/shared-types": "workspace:*",
    "@bienesraices/shared-utils": "workspace:*"
  }
}
```

### Fase 3: Migrar Backend (1 hora)

#### 3.1 Copiar código del backend
```bash
# Copiar todo el contenido del backend
cp -r ../14-bienesRaices/* apps/backend/
# (ajustar según dónde esté tu backend actual)
```

#### 3.2 Actualizar package.json del backend
```json
{
  "name": "@bienesraices/backend",
  "private": true,
  "version": "1.0.0",
  "scripts": {
    "dev": "nodemon src/index.js",
    "start": "node src/index.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint ."
  },
  "dependencies": {
    "@bienesraices/shared-types": "workspace:*",
    "@bienesraices/shared-utils": "workspace:*"
  }
}
```

### Fase 4: Crear Shared Packages (2 horas)

#### 4.1 Crear shared-types

**packages/shared-types/package.json**
```json
{
  "name": "@bienesraices/shared-types",
  "version": "1.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  }
}
```

**packages/shared-types/src/property.ts**
```typescript
export interface Property {
  id: string;
  titulo: string;
  descripcion: string;
  precio: number;
  habitaciones: number;
  estacionamiento: number;
  wc: number;
  imagen: string;
  categoriaId: number;
  precioId: number;
  usuarioId: string;
  lat: string;
  lng: string;
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
  lat: string;
  lng: string;
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
```

**packages/shared-types/src/user.ts**
```typescript
export interface User {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
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
```

**packages/shared-types/src/auth.ts**
```typescript
export interface AuthResponse {
  user: User;
  token: string;
}

export interface AuthError {
  message: string;
  code: 'INVALID_CREDENTIALS' | 'USER_EXISTS' | 'INVALID_TOKEN' | 'UNAUTHORIZED';
}
```

**packages/shared-types/src/index.ts**
```typescript
export * from './property';
export * from './user';
export * from './auth';
```

#### 4.2 Crear shared-utils

**packages/shared-utils/package.json**
```json
{
  "name": "@bienesraices/shared-utils",
  "version": "1.0.0",
  "private": true,
  "main": "./src/index.js",
  "exports": {
    ".": "./src/index.js",
    "./validation": "./src/validation.js",
    "./formatters": "./src/formatters.js",
    "./constants": "./src/constants.js"
  }
}
```

**packages/shared-utils/src/validation.js**
```javascript
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPrice = (price) => {
  return !isNaN(price) && price > 0;
};

export const isValidRooms = (rooms) => {
  return Number.isInteger(rooms) && rooms >= 0 && rooms <= 10;
};

export const passwordStrength = (password) => {
  if (password.length < 6) return 'weak';
  if (password.length < 10) return 'medium';
  if (password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
    return 'strong';
  }
  return 'medium';
};
```

**packages/shared-utils/src/formatters.js**
```javascript
export const formatPrice = (price) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(price);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
```

**packages/shared-utils/src/constants.js**
```javascript
export const API_VERSION = 'v1';

export const PROPERTY_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  SOLD: 'sold',
  ARCHIVED: 'archived',
};

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'No autorizado',
  INVALID_CREDENTIALS: 'Credenciales inválidas',
  USER_EXISTS: 'El usuario ya existe',
  NOT_FOUND: 'Recurso no encontrado',
  SERVER_ERROR: 'Error del servidor',
};
```

**packages/shared-utils/src/index.js**
```javascript
export * from './validation.js';
export * from './formatters.js';
export * from './constants.js';
```

---

## ⚙️ Configuración de Workspaces

### Opción A: npm workspaces (Recomendado - más simple)

**package.json (raíz)**
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
    "dev": "npm run dev --workspaces --if-present",
    "dev:frontend": "npm run dev -w @bienesraices/frontend",
    "dev:backend": "npm run dev -w @bienesraices/backend",
    "build": "npm run build --workspaces --if-present",
    "test": "npm run test --workspaces --if-present",
    "lint": "npm run lint --workspaces --if-present",
    "clean": "rm -rf node_modules apps/*/node_modules packages/*/node_modules",
    "install:all": "npm install"
  },
  "devDependencies": {
    "eslint": "^8.57.0",
    "prettier": "^3.0.0",
    "concurrently": "^8.2.0"
  }
}
```

**Comandos útiles con npm workspaces:**
```bash
# Instalar todo
npm install

# Ejecutar dev en todos los workspaces
npm run dev --workspaces

# Ejecutar dev solo en frontend
npm run dev -w @bienesraices/frontend

# Ejecutar dev solo en backend
npm run dev -w @bienesraices/backend

# Agregar dependencia a un workspace específico
npm install axios -w @bienesraices/frontend

# Agregar dependencia de desarrollo a la raíz
npm install -D eslint

# Ejecutar dev en frontend y backend simultáneamente
npx concurrently "npm run dev -w @bienesraices/frontend" "npm run dev -w @bienesraices/backend"
```

### Opción B: pnpm workspaces (Más rápido y eficiente)

**pnpm-workspace.yaml**
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

**package.json (raíz)**
```json
{
  "name": "bienesraices-monorepo",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "pnpm -r --parallel dev",
    "dev:frontend": "pnpm --filter @bienesraices/frontend dev",
    "dev:backend": "pnpm --filter @bienesraices/backend dev",
    "build": "pnpm -r build",
    "test": "pnpm -r test",
    "lint": "pnpm -r lint",
    "clean": "pnpm -r exec rm -rf node_modules && rm -rf node_modules"
  }
}
```

**Comandos útiles con pnpm:**
```bash
# Instalar todo
pnpm install

# Ejecutar dev en todos los paquetes en paralelo
pnpm -r --parallel dev

# Ejecutar dev solo en frontend
pnpm --filter @bienesraices/frontend dev

# Agregar dependencia a un workspace específico
pnpm add axios --filter @bienesraices/frontend

# Ejecutar comando en todos los workspaces
pnpm -r test
```

### Opción C: Turborepo (Más potente para proyectos grandes)

**turbo.json**
```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    },
    "lint": {
      "outputs": []
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

**package.json con Turborepo**
```json
{
  "scripts": {
    "dev": "turbo run dev --parallel",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint"
  },
  "devDependencies": {
    "turbo": "^1.10.0"
  }
}
```

---

## 📦 Scripts y Comandos

### Script de desarrollo concurrente

**package.json (raíz)**
```json
{
  "scripts": {
    "dev": "concurrently -n \"frontend,backend\" -c \"cyan,green\" \"npm run dev -w @bienesraices/frontend\" \"npm run dev -w @bienesraices/backend\"",
    "dev:frontend": "npm run dev -w @bienesraices/frontend",
    "dev:backend": "npm run dev -w @bienesraices/backend",
    "build:all": "npm run build --workspaces --if-present",
    "test:all": "npm run test --workspaces --if-present",
    "test:frontend": "npm run test -w @bienesraices/frontend",
    "test:backend": "npm run test -w @bienesraices/backend",
    "lint:all": "npm run lint --workspaces --if-present",
    "lint:fix": "npm run lint --workspaces --if-present -- --fix",
    "clean": "npm run clean --workspaces --if-present && rm -rf node_modules",
    "typecheck": "tsc --noEmit -p packages/shared-types/tsconfig.json"
  }
}
```

### Script de limpieza completa

**scripts/clean-install.sh**
```bash
#!/bin/bash

echo "🧹 Limpiando node_modules..."
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules

echo "🧹 Limpiando lock files..."
rm -f package-lock.json
rm -f apps/*/package-lock.json
rm -rf packages/*/package-lock.json

echo "📦 Instalando dependencias..."
npm install

echo "✅ Limpieza e instalación completas!"
```

### Script de migración de base de datos

**scripts/migrate-db.js**
```javascript
const { execSync } = require('child_process');

console.log('🔄 Ejecutando migraciones de base de datos...');

try {
  execSync('npm run migrate -w @bienesraices/backend', { stdio: 'inherit' });
  console.log('✅ Migraciones completadas exitosamente');
} catch (error) {
  console.error('❌ Error en migraciones:', error.message);
  process.exit(1);
}
```

---

## 🔄 CI/CD

### GitHub Actions

**.github/workflows/ci.yml**
```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: root
          MYSQL_DATABASE: bienesraices_test
        ports:
          - 3306:3306
        options: --health-cmd="mysqladmin ping" --health-interval=10s --health-timeout=5s --health-retries=3

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint:all

      - name: Type check
        run: npm run typecheck

      - name: Test Frontend
        run: npm run test:frontend

      - name: Test Backend
        env:
          DB_HOST: localhost
          DB_USER: root
          DB_PASS: root
          DB_NAME: bienesraices_test
        run: npm run test:backend

      - name: Build Frontend
        run: npm run build -w @bienesraices/frontend

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./apps/frontend/coverage/coverage-final.json,./apps/backend/coverage/coverage-final.json
```

**.github/workflows/deploy.yml**
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Build Frontend
        run: npm run build -w @bienesraices/frontend

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./apps/frontend

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Deploy to Railway/Render/Heroku
        # Configurar según tu servicio de hosting
        run: echo "Deploy backend"
```

---

## 🧪 Estrategia de Testing

### 1. Unit Tests (Por paquete)

**Frontend**: Vitest + React Testing Library
- Tests de componentes individuales
- Tests de hooks
- Tests de utilidades

**Backend**: Jest + Supertest
- Tests de controladores
- Tests de modelos
- Tests de middlewares

**Shared Packages**: Jest
- Tests de validadores
- Tests de formatters
- Tests de constantes

### 2. Integration Tests

**apps/backend/tests/integration/**
```javascript
// Ejemplo: test de API completa
describe('Properties API Integration', () => {
  it('should create, read, update, and delete a property', async () => {
    // Login
    const authResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: 'password' });

    const token = authResponse.body.token;

    // Create
    const createResponse = await request(app)
      .post('/api/properties')
      .set('Authorization', `Bearer ${token}`)
      .send({ titulo: 'Test Property', precio: 100000 });

    expect(createResponse.status).toBe(201);
    const propertyId = createResponse.body.id;

    // Read
    const getResponse = await request(app)
      .get(`/api/properties/${propertyId}`);

    expect(getResponse.status).toBe(200);
    expect(getResponse.body.titulo).toBe('Test Property');

    // Update
    const updateResponse = await request(app)
      .put(`/api/properties/${propertyId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ titulo: 'Updated Property' });

    expect(updateResponse.status).toBe(200);

    // Delete
    const deleteResponse = await request(app)
      .delete(`/api/properties/${propertyId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(deleteResponse.status).toBe(204);
  });
});
```

### 3. E2E Tests

**Playwright configuración**

**package.json (raíz)**
```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  },
  "devDependencies": {
    "@playwright/test": "^1.40.0"
  }
}
```

**playwright.config.js**
```javascript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:5173',
  },
  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: !process.env.CI,
  },
});
```

**tests/e2e/auth.spec.js**
```javascript
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should register, login, and access protected route', async ({ page }) => {
    // Register
    await page.goto('/auth/crear-cuenta');
    await page.fill('input[name="nombre"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="repetir_password"]', 'password123');
    await page.click('button[type="submit"]');

    // Should redirect to login
    await expect(page).toHaveURL('/auth/login');

    // Login
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Should be logged in and see dashboard
    await expect(page).toHaveURL('/');
    await expect(page.locator('text=Bienvenido')).toBeVisible();
  });
});
```

### 4. Contract Testing

**Usar shared-types para validar contratos**

**apps/backend/tests/contracts/property.contract.test.js**
```javascript
import { Property, PropertyCreateDTO } from '@bienesraices/shared-types';

describe('Property API Contract', () => {
  it('should return data matching Property interface', async () => {
    const response = await request(app).get('/api/properties/1');

    const property = response.body;

    // Validar que cumple con el contrato
    expect(property).toHaveProperty('id');
    expect(property).toHaveProperty('titulo');
    expect(property).toHaveProperty('precio');
    expect(typeof property.precio).toBe('number');
    // ... más validaciones
  });
});
```

---

## 🚀 Despliegue

### Frontend (Vercel - Recomendado)

**vercel.json**
```json
{
  "buildCommand": "npm run build -w @bienesraices/frontend",
  "outputDirectory": "apps/frontend/dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Backend (Railway/Render/Heroku)

**Railway**:
```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Crear proyecto
railway init

# Deploy
railway up
```

**Procfile (para Heroku)**
```
web: npm start -w @bienesraices/backend
```

**render.yaml (para Render)**
```yaml
services:
  - type: web
    name: bienesraices-api
    env: node
    buildCommand: npm install
    startCommand: npm start -w @bienesraices/backend
    envVars:
      - key: NODE_ENV
        value: production
      - key: DB_HOST
        fromDatabase:
          name: bienesraices-db
          property: host
```

---

## ✅ Checklist de Migración

### Preparación
- [ ] Hacer backup de ambos repositorios actuales
- [ ] Crear nuevo repositorio para el monorepo
- [ ] Revisar que no haya cambios sin commitear

### Estructura
- [ ] Crear estructura de directorios (apps, packages, docs, scripts)
- [ ] Inicializar Git en el nuevo repo
- [ ] Crear package.json raíz con workspaces

### Frontend
- [ ] Copiar código del frontend a apps/frontend
- [ ] Actualizar package.json con scope @bienesraices/frontend
- [ ] Actualizar imports para usar shared packages
- [ ] Verificar que dev server funciona
- [ ] Verificar que build funciona
- [ ] Verificar que tests funcionan

### Backend
- [ ] Copiar código del backend a apps/backend
- [ ] Actualizar package.json con scope @bienesraices/backend
- [ ] Actualizar imports para usar shared packages
- [ ] Configurar variables de entorno
- [ ] Verificar conexión a base de datos
- [ ] Verificar que el servidor inicia correctamente

### Shared Packages
- [ ] Crear shared-types con interfaces TypeScript
- [ ] Crear shared-utils con utilidades compartidas
- [ ] Crear eslint-config compartido
- [ ] Verificar que se pueden importar desde apps

### Testing
- [ ] Configurar tests unitarios para frontend
- [ ] Configurar tests unitarios para backend
- [ ] Configurar tests de integración
- [ ] Configurar Playwright para E2E
- [ ] Crear script para ejecutar todos los tests

### CI/CD
- [ ] Configurar GitHub Actions para CI
- [ ] Configurar GitHub Actions para deploy
- [ ] Configurar secrets necesarios
- [ ] Probar flujo completo de CI/CD

### Documentación
- [ ] Crear README.md principal
- [ ] Documentar comandos de desarrollo
- [ ] Documentar proceso de deploy
- [ ] Crear CONTRIBUTING.md

### Deploy
- [ ] Configurar deploy de frontend (Vercel)
- [ ] Configurar deploy de backend (Railway/Render)
- [ ] Configurar base de datos en producción
- [ ] Configurar variables de entorno en producción
- [ ] Probar deploy completo

### Post-migración
- [ ] Verificar que todo funciona en producción
- [ ] Archivar repositorios antiguos
- [ ] Actualizar enlaces y referencias
- [ ] Comunicar cambios al equipo

---

## 📚 Recursos Adicionales

### Documentación
- [npm workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces)
- [pnpm workspaces](https://pnpm.io/workspaces)
- [Turborepo](https://turbo.build/repo/docs)
- [Monorepo Tools](https://monorepo.tools/)

### Herramientas recomendadas
- **Nx**: Framework completo para monorepos
- **Turborepo**: Build system para monorepos (más simple)
- **Lerna**: Gestión de paquetes múltiples (legacy)
- **Changesets**: Gestión de versiones y changelogs

### Ejemplos de monorepos
- [Vercel monorepo examples](https://github.com/vercel/turborepo/tree/main/examples)
- [Nx examples](https://github.com/nrwl/nx-examples)

---

## 🎯 Próximos Pasos

1. **Revisar este plan** y hacer ajustes según necesidades específicas
2. **Hacer backup** de los repositorios actuales
3. **Ejecutar Fase 1** (Preparación) - 30 min
4. **Ejecutar Fase 2** (Migrar Frontend) - 1 hora
5. **Ejecutar Fase 3** (Migrar Backend) - 1 hora
6. **Ejecutar Fase 4** (Crear Shared Packages) - 2 horas
7. **Testing completo** - 1 hora
8. **Deploy a producción** - 1 hora

**Tiempo estimado total**: 6-8 horas

---

## 💡 Consejos Finales

1. **Migrar incrementalmente**: No intentes migrar todo de una vez
2. **Probar frecuentemente**: Después de cada fase, verifica que todo funciona
3. **Documentar problemas**: Anota cualquier issue que encuentres
4. **Usar tipos compartidos desde el inicio**: Aprovecha TypeScript
5. **Automatizar todo**: Scripts, CI/CD, validaciones
6. **Mantener compatibilidad**: Durante la migración, ambos repos pueden coexistir

---

**Creado**: 2026-02-09
**Autor**: Claude Sonnet 4.5
**Versión**: 1.0
