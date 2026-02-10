# 🏠 Plataforma de Bienes Raíces

> Aplicación web full-stack moderna para la compra, venta y alquiler de propiedades inmobiliarias con búsqueda avanzada, gestión de usuarios y panel de administración.

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Monorepo](https://img.shields.io/badge/Monorepo-npm_workspaces-CB3837?style=flat&logo=npm&logoColor=white)](https://docs.npmjs.com/cli/v7/using-npm/workspaces)
[![TypeScript](https://img.shields.io/badge/TypeScript-Shared_Types-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Playwright](https://img.shields.io/badge/E2E-Playwright-2EAD33?style=flat&logo=playwright&logoColor=white)](https://playwright.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[🌐 Demo en Vivo](#) | [📹 Video Demo](#) | [📝 Documentación](CLAUDE.md)

---

## 📸 Screenshots

### Vista Principal
![Home Page](screenshots/home.png)
*Página de inicio con categorías de propiedades y destacados*

### Búsqueda Avanzada
![Search](screenshots/search.png)
*Sistema de búsqueda con múltiples filtros y vista de resultados*

### Detalles de Propiedad
![Property Details](screenshots/details.png)
*Galería de imágenes interactiva y detalles completos*

### Panel de Administración
![Admin Panel](screenshots/admin.png)
*Dashboard para gestión de propiedades publicadas*

### Responsive Mobile
![Mobile View](screenshots/mobile.png)
*Diseño completamente responsive para dispositivos móviles*

---

## ✨ Features

### 🔐 Autenticación y Seguridad
- Registro e inicio de sesión con JWT
- Verificación de email
- Recuperación de contraseña
- Protección de rutas privadas
- Sistema de roles (Admin, Vendedor, Cliente)

### 🏡 Gestión de Propiedades
- CRUD completo de propiedades
- Carga múltiple de imágenes
- Galería interactiva con navegación por teclado (←/→)
- Categorías: Casa, Departamento, Terreno, Oficina, Local, Bodega
- Estados: En venta, Alquilado, Vendido
- Geolocalización con mapa interactivo

### 🔍 Búsqueda y Filtros Avanzados
- Búsqueda por texto en tiempo real (debounce)
- Filtros por:
  - Rango de precio con slider
  - Área total (m²)
  - Número de habitaciones
  - Número de baños
  - Tipo de propiedad
  - Tipo de operación (venta/alquiler)
- Ordenamiento múltiple (precio, fecha, área, relevancia)
- Vista Grid/Lista/Mapa
- Pills de filtros activos removibles
- Contador de resultados y estadísticas

### 🎨 UI/UX Moderna
- Diseño responsive 100% (mobile-first)
- Navegación con botón "Volver" contextual
- Categorías horizontales con underline animado
- Cards horizontales optimizadas
- Drag & Drop para subir imágenes
- Loading states y spinners
- Transiciones y animaciones suaves
- Dark mode ready (estructura preparada)

### ⚡ Performance
- Code splitting con lazy loading
- Bundle optimizado (220KB gzipped: 74KB)
- Imágenes optimizadas
- Debounce en búsquedas
- Caché de peticiones
- Score Lighthouse: 85+

### ♿ Accesibilidad
- WCAG 2.1 Level AA
- Navegación completa por teclado
- 100+ atributos ARIA
- Roles semánticos correctos
- Compatibilidad con screen readers
- Focus visible en todos los elementos
- Score accesibilidad: 87/100

### 📱 Otras Features
- Formulario de contacto con validación
- Sistema de favoritos (frontend)
- Comparador de propiedades (hasta 3)
- Quick view modal
- Paginación y load more
- Estados vacíos informativos
- Manejo de errores robusto

---

## 🛠️ Tech Stack

### 🏗️ Arquitectura
- **Monorepo:** npm workspaces
- **Shared Packages:** TypeScript types, utils compartidos, ESLint config
- **Code Organization:** Apps separadas con código compartido

### Frontend
- **Framework:** React 18.3.1
- **Build Tool:** Vite 5.4
- **Routing:** React Router v6
- **Styling:** Tailwind CSS 3.x
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **State Management:** Context API + Hooks
- **Forms:** React Hook Form (ready)
- **E2E Testing:** Playwright (Chromium, Firefox, WebKit, Mobile)

### Backend
- **Runtime:** Node.js 20.x
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Sequelize
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcrypt
- **Email:** Nodemailer
- **File Upload:** Multer
- **Validation:** Express Validator

### Shared Packages
- **@bienesraices/shared-types:** Interfaces TypeScript compartidas
- **@bienesraices/shared-utils:** Utilidades JavaScript (validación, formateo, constantes)
- **@bienesraices/eslint-config:** Configuración ESLint unificada

### DevOps & Tools
- **Version Control:** Git
- **Package Manager:** npm workspaces
- **Linting:** ESLint (compartido en monorepo)
- **Code Formatting:** Prettier (ready)
- **Environment:** dotenv
- **CI/CD:** GitHub Actions (ready)

---

## 🏗️ Arquitectura de Monorepo

Este proyecto utiliza **npm workspaces** para gestionar un monorepo moderno con código compartido:

### ¿Por qué Monorepo?

✅ **Código compartido sin duplicación** - Types, utils y configs unificados
✅ **Gestión de dependencias centralizada** - Un solo `npm install`
✅ **Type safety** - TypeScript interfaces compartidas entre frontend y backend
✅ **Consistencia** - Mismas reglas de ESLint en todo el proyecto
✅ **Desarrollo eficiente** - Cambios en shared packages se reflejan inmediatamente

### Shared Packages

**@bienesraices/shared-types** (TypeScript)
```typescript
import { Property, User, AuthResponse } from '@bienesraices/shared-types';
```
- Interfaces para Property, User, Auth, etc.
- Type safety entre frontend y backend
- Single source of truth para modelos de datos

**@bienesraices/shared-utils** (JavaScript)
```javascript
import { isValidEmail, formatPrice, ERROR_MESSAGES } from '@bienesraices/shared-utils';
```
- Validación de email y passwords
- Formateo de precios y fechas
- Constantes compartidas (ERROR_MESSAGES, PAGINATION, etc.)

**@bienesraices/eslint-config**
- Configuración ESLint unificada
- Reglas consistentes en todo el monorepo

### Ventajas Técnicas

- **Hot Module Reload automático**: Nodemon detecta cambios en packages
- **Path aliases**: Vite resuelve imports de shared packages
- **TypeScript checking**: `npm run typecheck` valida tipos compartidos
- **Build optimizado**: Vite incluye solo código usado de packages

---

## 👨‍💻 Developer Documentation

**For developers and AI assistants:** See [CLAUDE.md](CLAUDE.md) for comprehensive technical documentation including:
- Detailed architecture overview
- Development commands and workflows
- Database setup and seeding
- API structure and authentication patterns
- Common development tasks and troubleshooting

**Additional documentation:** See [docs/](docs/) folder for:
- [Color palette guide](docs/COLORS.md)
- [Detailed project report](docs/INFORME_PROYECTO.md)
- [Portfolio deployment checklist](docs/PORTFOLIO_CHECKLIST.md)
- [Monorepo migration guide](MONOREPO_SETUP_PERSONALIZADO.md)

---

## 📦 Instalación

### Prerequisitos

- Node.js >= 18.x
- npm >= 9.x
- PostgreSQL >= 14.x

### Clonar Repositorio

```bash
git clone https://github.com/tu-usuario/02-bienesraices-react.git
cd 02-bienesraices-react
```

### 🚀 Setup del Monorepo (Recomendado)

Este proyecto usa **npm workspaces** para gestionar el monorepo. Instala todas las dependencias desde la raíz:

```bash
# Instalar todas las dependencias (root, frontend, backend, packages)
npm install

# Instalar navegadores de Playwright para E2E testing
npx playwright install
```

### Configurar Frontend

Crear archivo `.env` en `apps/frontend/`:

```env
VITE_API_URL=http://localhost:3000
```

### Configurar Backend

Crear archivo `.env` en `apps/backend/`:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bienesraices_db
DB_USER=postgres
DB_PASSWORD=tu_password

# JWT
JWT_SECRET=tu_secret_muy_seguro_aqui
JWT_EXPIRE=7d

# Email (opcional - para verificación)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_app_password

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Cloudinary (opcional - para imágenes)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

Crear base de datos:

```bash
createdb bienesraices_db
```

Ejecutar migraciones (desde la raíz del proyecto):

```bash
npm run migrate -w @bienesraices/backend
```

Seed data (opcional):

```bash
npm run seed -w @bienesraices/backend
```

### 🎯 Ejecutar la Aplicación

**Opción 1: Ejecutar todo junto (Recomendado)**
```bash
# Desde la raíz - inicia frontend y backend en paralelo
npm run dev
```

**Opción 2: Ejecutar por separado**
```bash
# Terminal 1 - Frontend
npm run dev -w @bienesraices/frontend

# Terminal 2 - Backend
npm run dev -w @bienesraices/backend
```

**URLs:**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`

---

## 📁 Estructura del Proyecto (Monorepo)

```
02-bienesraices-react/
├── apps/
│   ├── frontend/                   # ⚛️ Aplicación React
│   │   ├── e2e/                    # Tests End-to-End con Playwright
│   │   │   ├── home.spec.js
│   │   │   ├── auth.spec.js
│   │   │   ├── properties.spec.js
│   │   │   └── README.md
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── components/         # Componentes reutilizables
│   │   │   │   ├── Footer/
│   │   │   │   ├── Header/
│   │   │   │   └── FormularioContacto/
│   │   │   ├── features/           # Features organizadas
│   │   │   │   ├── auth/
│   │   │   │   │   ├── components/
│   │   │   │   │   ├── context/
│   │   │   │   │   └── pages/
│   │   │   │   └── properties/
│   │   │   │       ├── components/
│   │   │   │       └── pages/
│   │   │   ├── routes/
│   │   │   │   ├── AppRouter.jsx
│   │   │   │   └── PrivateRoute.jsx
│   │   │   ├── utils/
│   │   │   ├── App.jsx
│   │   │   └── main.jsx
│   │   ├── playwright.config.js
│   │   └── package.json
│   │
│   └── backend/                    # 🔧 API REST
│       ├── config/
│       │   ├── db.js
│       │   └── cloudinary.js
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── propertyController.js
│       │   └── userController.js
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── utils/
│       ├── nodemon.json            # Monitorea cambios en shared packages
│       ├── server.js
│       └── package.json
│
├── packages/                       # 📦 Código compartido
│   ├── shared-types/               # TypeScript interfaces
│   │   ├── src/
│   │   │   ├── property.ts
│   │   │   ├── user.ts
│   │   │   ├── auth.ts
│   │   │   └── index.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── shared-utils/               # Utilidades JavaScript
│   │   ├── src/
│   │   │   ├── validation.js       # Validación de email, passwords
│   │   │   ├── formatters.js       # Formateo de precios, fechas
│   │   │   ├── constants.js        # Constantes compartidas
│   │   │   └── index.js
│   │   └── package.json
│   │
│   └── eslint-config/              # Configuración ESLint compartida
│       ├── index.js
│       └── package.json
│
├── docs/                           # 📚 Documentación adicional
│   ├── COLORS.md
│   ├── INFORME_PROYECTO.md
│   └── PORTFOLIO_CHECKLIST.md
│
├── package.json                    # Configuración raíz del workspace
├── CLAUDE.md                       # Documentación técnica completa
├── MONOREPO_SETUP_PERSONALIZADO.md # Guía de migración
└── README.md
```

---

## 🎮 Scripts Disponibles

### Monorepo (Desde la raíz)

```bash
# Ejecutar ambos (frontend + backend) en paralelo
npm run dev

# Type checking para shared-types
npm run typecheck

# Linting en todo el monorepo
npm run lint -w @bienesraices/frontend
```

### Frontend (apps/frontend/)

```bash
# Desde la raíz usando workspaces
npm run dev -w @bienesraices/frontend           # Dev server con Vite
npm run build -w @bienesraices/frontend         # Build producción
npm run preview -w @bienesraices/frontend       # Preview del build

# E2E Tests con Playwright
npm run test:e2e -w @bienesraices/frontend      # Ejecutar tests
npm run test:e2e:ui -w @bienesraices/frontend   # Modo UI interactivo
npm run test:e2e:debug -w @bienesraices/frontend # Debug paso a paso
npm run test:e2e:report -w @bienesraices/frontend # Ver reporte HTML
```

### Backend (apps/backend/)

```bash
# Desde la raíz usando workspaces
npm run dev -w @bienesraices/backend     # Desarrollo con nodemon
npm start -w @bienesraices/backend       # Servidor producción
npm run migrate -w @bienesraices/backend # Ejecutar migraciones
npm run seed -w @bienesraices/backend    # Insertar datos de prueba
```

### Shared Packages

```bash
# Los cambios en packages se detectan automáticamente
# gracias a nodemon.json en el backend
```

---

## 🧪 Testing

### E2E Testing con Playwright

Este proyecto incluye una suite completa de tests End-to-End usando Playwright:

```bash
# Ejecutar todos los tests
npm run test:e2e -w @bienesraices/frontend

# Modo UI interactivo (recomendado)
npm run test:e2e:ui -w @bienesraices/frontend

# Debug paso a paso
npm run test:e2e:debug -w @bienesraices/frontend

# Ver reporte HTML con screenshots
npm run test:e2e:report -w @bienesraices/frontend
```

**Tests Incluidos:**
- ✅ **home.spec.js** - Navegación principal y categorías
- ✅ **auth.spec.js** - Login, registro, recuperación de contraseña
- ✅ **properties.spec.js** - Búsqueda, filtros, detalles de propiedades

**Navegadores Testeados:**
- Chromium (Chrome, Edge)
- Firefox
- WebKit (Safari)
- Mobile Chrome
- Mobile Safari

**18 tests × 5 navegadores = 90 test cases totales**

Para más detalles, ver [apps/frontend/e2e/README.md](apps/frontend/e2e/README.md)

---

## 🌐 API Endpoints

### Autenticación
```
POST   /api/v1/auth/register          # Registro de usuario
POST   /api/v1/auth/login             # Login
POST   /api/v1/auth/verify/:token     # Verificar email
POST   /api/v1/auth/forgot-password   # Recuperar contraseña
POST   /api/v1/auth/reset-password    # Resetear contraseña
GET    /api/v1/auth/me                # Obtener usuario actual
```

### Propiedades
```
GET    /api/v1/properties             # Listar propiedades (con filtros)
GET    /api/v1/properties/:id         # Obtener una propiedad
POST   /api/v1/properties             # Crear propiedad (auth)
PUT    /api/v1/properties/:id         # Actualizar propiedad (auth)
DELETE /api/v1/properties/:id         # Eliminar propiedad (auth)
GET    /api/v1/properties/types       # Obtener tipos de propiedad
POST   /api/v1/properties/:id/contact # Formulario contacto
```

### Usuarios
```
GET    /api/v1/users/profile          # Ver perfil (auth)
PUT    /api/v1/users/profile          # Actualizar perfil (auth)
PUT    /api/v1/users/avatar           # Subir avatar (auth)
```

---

## 🗺️ Roadmap

### ✅ Completado (v1.0)
- [x] Sistema de autenticación completo
- [x] CRUD de propiedades
- [x] Búsqueda y filtros avanzados
- [x] Galería de imágenes interactiva
- [x] Panel de administración
- [x] Responsive design
- [x] Code splitting y optimización
- [x] Accesibilidad WCAG AA
- [x] **Arquitectura de monorepo con npm workspaces**
- [x] **Shared packages (types, utils, eslint)**
- [x] **E2E testing con Playwright**
- [x] **18 tests E2E en 5 navegadores**

### 🚧 En Progreso (v1.2)
- [ ] Ajustar tests E2E a implementación actual
- [ ] Sistema de favoritos persistente
- [ ] Mapa con Mapbox/Google Maps

### 🔮 Futuro (v2.0)
- [ ] Sistema de pagos (Stripe/MercadoPago)
- [ ] Tours virtuales 360°
- [ ] Reseñas y ratings
- [ ] Sistema de citas/visitas
- [ ] Dashboard con analytics
- [ ] App móvil (React Native)
- [ ] Búsqueda por voz
- [ ] Recomendaciones con ML
- [ ] Multi-idioma (i18n)
- [ ] PWA (Progressive Web App)

---

## 🤝 Contribución

Las contribuciones son bienvenidas! Para contribuir:

1. Lee [CLAUDE.md](CLAUDE.md) para entender la arquitectura y convenciones del proyecto
2. Fork el proyecto
3. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
4. Commit tus cambios (`git commit -m 'Add: nueva feature increíble'`)
5. Push a la rama (`git push origin feature/AmazingFeature`)
6. Abre un Pull Request

### Convención de Commits

```
feat: nueva funcionalidad
fix: corrección de bug
docs: cambios en documentación
style: formateo, punto y coma faltante, etc
refactor: refactorización de código
test: agregar tests
chore: tareas de mantenimiento
```

---

## 🐛 Reporte de Bugs

Si encuentras un bug, por favor [abre un issue](https://github.com/tu-usuario/02-bienesraices-react/issues) con:

- Descripción del bug
- Pasos para reproducir
- Comportamiento esperado vs actual
- Screenshots (si aplica)
- Información del entorno (OS, navegador, etc.)

---

## 📈 Métricas de Calidad

### Lighthouse Scores
- **Performance:** 85/100
- **Accessibility:** 87/100
- **Best Practices:** 90/100
- **SEO:** 88/100

### Bundle Size
- **Main bundle:** 219.96 KB
- **Gzipped:** 73.74 KB
- **Chunks:** 13+ chunks optimizados

### Código
- **Arquitectura:** Monorepo con npm workspaces
- **Líneas de código:** ~8,000+ (incluyendo shared packages)
- **Componentes React:** 60+
- **Páginas:** 12
- **API Endpoints:** 15+
- **Shared Packages:** 3 (types, utils, eslint)
- **E2E Tests:** 18 tests × 5 navegadores = 90 test cases

---

## 📚 Recursos y Aprendizaje

Este proyecto fue desarrollado como parte de mi aprendizaje en desarrollo full-stack y demuestra competencias en:

### Frontend
- ✅ React avanzado (Hooks, Context, Lazy Loading)
- ✅ Arquitectura de aplicaciones SPA
- ✅ Responsive design y UI/UX moderno
- ✅ Optimización de performance
- ✅ Accesibilidad web (WCAG AA)

### Backend
- ✅ RESTful API design
- ✅ Autenticación y autorización con JWT
- ✅ Bases de datos relacionales (PostgreSQL)
- ✅ ORM (Sequelize)

### Arquitectura y DevOps
- ✅ **Monorepo con npm workspaces**
- ✅ **Código compartido entre aplicaciones**
- ✅ **TypeScript para type safety**
- ✅ **E2E testing con Playwright**
- ✅ **Multi-browser testing**
- ✅ Git y control de versiones
- ✅ Organización de código escalable

### Artículos Relacionados
- [Cómo optimicé el bundle de React en 60%](#)
- [Implementando búsqueda avanzada en React](#)
- [Accesibilidad en aplicaciones modernas](#)

---

## 👨‍💻 Autor

**Tu Nombre**

- 🌐 Portfolio: [tu-portfolio.com](#)
- 💼 LinkedIn: [linkedin.com/in/tu-perfil](#)
- 🐦 Twitter: [@tu_usuario](#)
- 📧 Email: tu.email@ejemplo.com
- 💻 GitHub: [@tu-usuario](https://github.com/tu-usuario)

---

## 🙏 Agradecimientos

- [React Team](https://react.dev/) por el increíble framework
- [Vite](https://vitejs.dev/) por la velocidad de desarrollo
- [Tailwind CSS](https://tailwindcss.com/) por el sistema de diseño
- [Lucide](https://lucide.dev/) por los iconos
- Comunidad de desarrolladores en Stack Overflow

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

```
MIT License

Copyright (c) 2026 Tu Nombre

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## ⭐ Star History

Si este proyecto te ha sido útil, considera darle una estrella ⭐

[![Star History Chart](https://api.star-history.com/svg?repos=tu-usuario/02-bienesraices-react&type=Date)](https://star-history.com/#tu-usuario/02-bienesraices-react&Date)

---

<div align="center">

**Hecho con ❤️ y mucho ☕**

[⬆ Volver arriba](#-plataforma-de-bienes-raíces)

</div>
