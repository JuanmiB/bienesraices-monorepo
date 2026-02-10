# 🚀 Migración a Monorepo - Pasos Rápidos

**Tiempo total:** ~2.5 horas
**Documento completo:** Ver `MONOREPO_SETUP_PERSONALIZADO.md`

---

## ✅ Checklist Ejecutable

### 📦 Fase 1: Preparación (5 min)

```bash
cd ~/Desktop/proyectos/02-bienesraices-react

# 1. Backup
tar -czf ../backup-bienesraices-$(date +%Y%m%d).tar.gz .

# 2. Verificar git limpio
git status

# 3. Crear estructura
mkdir -p apps packages

# 4. Mover carpetas
mv front apps/frontend
mv back apps/backend

# 5. Verificar
ls -la apps/
```

---

### 📄 Fase 2: Package.json Root (10 min)

**Crear:** `package.json` en la raíz

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
    "test": "npm run test --workspaces --if-present",
    "lint": "npm run lint --workspaces --if-present",
    "clean": "rm -rf node_modules apps/*/node_modules packages/*/node_modules",
    "typecheck": "tsc --noEmit -p packages/shared-types/tsconfig.json"
  },
  "devDependencies": {
    "concurrently": "^8.2.2",
    "typescript": "^5.3.3"
  }
}
```

```bash
# Instalar
npm install
```

---

### ⚛️ Fase 3: Actualizar Frontend (15 min)

**Editar:** `apps/frontend/package.json`

Cambiar línea 2:
```json
"name": "@bienesraices/frontend",
```

Agregar al final de `dependencies`:
```json
"@bienesraices/shared-types": "workspace:*",
"@bienesraices/shared-utils": "workspace:*"
```

**Editar:** `apps/frontend/vite.config.js`

Agregar alias en `resolve`:
```javascript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
    '@features': path.resolve(__dirname, './src/features'),
    '@components': path.resolve(__dirname, './src/components'),
    '@bienesraices/shared-types': path.resolve(__dirname, '../../packages/shared-types/src'),
    '@bienesraices/shared-utils': path.resolve(__dirname, '../../packages/shared-utils/src'),
  },
},
```

---

### 🔧 Fase 4: Actualizar Backend (15 min)

**Editar:** `apps/backend/package.json`

Cambiar línea 2:
```json
"name": "@bienesraices/backend",
```

Agregar al final de `dependencies`:
```json
"@bienesraices/shared-types": "workspace:*",
"@bienesraices/shared-utils": "workspace:*"
```

Agregar a `devDependencies`:
```json
"nodemon": "^3.0.2"
```

Actualizar `scripts`:
```json
"dev": "nodemon server.js",
```

**Crear:** `apps/backend/nodemon.json`

```json
{
  "watch": [".", "../../packages/shared-types/src", "../../packages/shared-utils/src"],
  "ext": "js,json,ts",
  "ignore": ["node_modules", "*.test.js"],
  "exec": "node server.js"
}
```

---

### 📦 Fase 5: Crear Shared Packages (45 min)

#### 5.1 shared-types

```bash
mkdir -p packages/shared-types/src
```

**Crear:** `packages/shared-types/package.json`
```json
{
  "name": "@bienesraices/shared-types",
  "version": "1.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts"
}
```

**Crear:** `packages/shared-types/tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "noEmit": true
  },
  "include": ["src/**/*"]
}
```

**Crear archivos TypeScript:**
- `packages/shared-types/src/property.ts` - Ver documento completo
- `packages/shared-types/src/user.ts` - Ver documento completo
- `packages/shared-types/src/auth.ts` - Ver documento completo
- `packages/shared-types/src/categoria.ts` - Ver documento completo
- `packages/shared-types/src/index.ts` - Exports

#### 5.2 shared-utils

```bash
mkdir -p packages/shared-utils/src
```

**Crear:** `packages/shared-utils/package.json`
```json
{
  "name": "@bienesraices/shared-utils",
  "version": "1.0.0",
  "private": true,
  "main": "./src/index.js",
  "type": "module"
}
```

**Crear archivos JavaScript:**
- `packages/shared-utils/src/validation.js` - Ver documento completo
- `packages/shared-utils/src/formatters.js` - Ver documento completo
- `packages/shared-utils/src/constants.js` - Ver documento completo
- `packages/shared-utils/src/index.js` - Exports

#### 5.3 eslint-config

```bash
mkdir -p packages/eslint-config
```

**Crear:** `packages/eslint-config/package.json`
```json
{
  "name": "@bienesraices/eslint-config",
  "version": "1.0.0",
  "private": true,
  "main": "index.js"
}
```

**Crear:** `packages/eslint-config/index.js` - Ver documento completo

---

### 🔄 Fase 6: Instalar (5 min)

```bash
# Limpiar
npm run clean

# Instalar todo
npm install

# Verificar workspaces
npm list --depth=0 -w
```

**Deberías ver:**
```
@bienesraices/backend
@bienesraices/frontend
@bienesraices/shared-types
@bienesraices/shared-utils
@bienesraices/eslint-config
```

---

### 🔗 Fase 7: Actualizar Imports (30 min)

**Frontend - Ejemplo:** `apps/frontend/src/api/auth.js`

```javascript
import { ERROR_MESSAGES } from '@bienesraices/shared-utils/constants';
import { isValidEmail } from '@bienesraices/shared-utils/validation';

export const login = async (email, password) => {
  if (!isValidEmail(email)) {
    throw new Error('Email inválido');
  }

  // ... resto del código
};
```

**Backend - Ejemplo:** `apps/backend/controllers/usuarioController.js`

```javascript
import { isValidEmail, isValidPassword } from '@bienesraices/shared-utils/validation';
import { ERROR_MESSAGES } from '@bienesraices/shared-utils/constants';

const formularioLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: ERROR_MESSAGES.INVALID_CREDENTIALS });
  }

  // ... resto del código
};
```

---

### 🧹 Fase 8: Actualizar .gitignore (2 min)

**Agregar a:** `.gitignore`

```gitignore
# Dependencies
node_modules/
apps/*/node_modules/
packages/*/node_modules/

# Environment
.env
apps/*/.env

# Build
dist/
apps/*/dist/

# Uploads
apps/backend/public/uploads/
```

---

### ✅ Fase 9: Verificar (10 min)

```bash
# 1. Type checking
npm run typecheck
# ✅ Debe pasar sin errores

# 2. Desarrollo
npm run dev
# ✅ Debe levantar frontend (5173) y backend (4000)

# 3. Build frontend
npm run build:frontend
# ✅ Debe crear apps/frontend/dist/

# 4. Verificar en navegador
# Frontend: http://localhost:5173
# ✅ Debe cargar correctamente

# 5. Probar API
# ✅ Frontend debe conectarse con backend
```

---

### 📝 Fase 10: Commit (5 min)

```bash
git add .
git status

git commit -m "$(cat <<'EOF'
refactor: migrate to monorepo with npm workspaces

- Restructured project into apps/ and packages/
- Created shared-types package (TypeScript interfaces)
- Created shared-utils package (validation, formatters, constants)
- Configured npm workspaces
- Updated frontend and backend to use shared packages
- Added concurrent dev script for both apps

Structure:
- apps/frontend (React + Vite)
- apps/backend (Express + Sequelize)
- packages/shared-types (TS interfaces)
- packages/shared-utils (JS utilities)

Benefits:
- No code duplication between frontend/backend
- Type-safe API contracts
- Single source of truth for validation and constants
- Easier to add mobile app in the future

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"
```

---

## 🎯 Comandos Diarios

```bash
# Desarrollo (ambos)
npm run dev

# Solo frontend
npm run dev:frontend

# Solo backend
npm run dev:backend

# Build
npm run build:frontend

# Tests
npm run test

# Type checking
npm run typecheck

# Limpiar y reinstalar
npm run clean && npm install
```

---

## 🚀 Siguientes Pasos

1. ✅ **Ahora:** Actualizar más archivos para usar shared packages
2. 🔄 **Esta semana:** Resolver tests del frontend
3. 📱 **Próximo mes:** Considerar agregar app móvil
4. 🌐 **Cuando esté listo:** Deploy a Vercel + Railway

---

## 📚 Documentación

- **Guía completa:** `MONOREPO_SETUP_PERSONALIZADO.md`
- **Plan original:** `MONOREPO_MIGRATION_PLAN.md`
- **Este documento:** Quick start para referencia rápida

---

**¿Problemas?** Ver sección Troubleshooting en `MONOREPO_SETUP_PERSONALIZADO.md`
