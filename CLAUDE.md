# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack real estate platform for buying, selling, and renting properties. React + Vite frontend with Express.js backend using Sequelize ORM (MySQL dev, PostgreSQL production). Features advanced search, image galleries, authentication, and admin dashboard.

## Project Structure

**npm workspaces monorepo** with the following structure:

- `apps/frontend/` - React 18.3 + Vite 5.3.5 + Tailwind CSS frontend (`@bienesraices/frontend`)
- `apps/backend/` - Express.js + Sequelize backend (`@bienesraices/backend`)
- `packages/shared-types/` - Shared TypeScript type definitions (`@bienesraices/shared-types`)
- `packages/shared-utils/` - Shared utility functions (`@bienesraices/shared-utils`)
- `packages/eslint-config/` - Shared ESLint configuration

**Workspace Management:**
- Root `package.json` defines workspaces and runs commands across all packages
- Use `-w` flag to target specific workspace: `npm run dev -w @bienesraices/frontend`
- Shared packages are automatically linked via npm workspaces
- Install dependencies at root level: `npm install`

### Backend Architecture (`apps/backend/`)

```
apps/backend/
├── config/           # Database, Passport, Cloudinary config
├── controllers/      # Request handlers (auth, properties, users)
├── middleware/       # Auth, error handling, image upload
├── models/           # Sequelize models (User, Property, PropertyImage, Amenity)
├── router/
│   ├── healthRouter.js
│   └── v1/           # API v1 routes (auth, properties, users)
├── helpers/          # Logger, utilities
├── seed/             # Database seeder
└── server.js         # Express app entry point
```

**Key Backend Patterns:**
- Models define relationships in their respective files (not centralized)
- Uses Passport.js with JWT strategy for authentication
- Cloudinary integration for image uploads via Multer
- Custom error handler middleware catches all errors
- Rate limiting (100 requests per 15 min) and Helmet security

**Database Models:**
- `User` - HasMany → `Property`
- `Property` - BelongsTo → `User`, HasMany → `PropertyImage`, BelongsToMany → `Amenity`
- `PropertyImage` - BelongsTo → `Property`
- `Amenity` - BelongsToMany → `Property` (through `PropertyAmenity`)

### Frontend Architecture (`apps/frontend/`)

```
apps/frontend/src/
├── app/
│   └── providers/     # Context providers wrapper
├── features/          # Feature-based modules
│   ├── auth/          # Login, Register, Password Reset
│   │   ├── components/
│   │   ├── pages/
│   │   └── context/   # AuthContext
│   ├── home/          # Landing page, featured properties
│   ├── properties/    # Search, filters, details
│   │   ├── components/
│   │   │   ├── search/  # SearchToolbar, FilterPanel, Cards
│   │   │   └── detail/  # Gallery, Info, Map
│   │   └── pages/
│   ├── admin/         # Property CRUD, dashboard
│   └── user/          # Profile management
├── shared/
│   ├── components/    # Reusable UI components
│   ├── config/        # API config
│   ├── services/      # API services
│   ├── utils/         # Helper functions
│   └── hooks/         # Custom React hooks
├── routes/            # AppRouter with lazy loading
├── test/              # Test setup files
└── App.jsx
```

**Key Frontend Patterns:**
- Feature-based folder structure (not component-based)
- Path aliases configured in `vite.config.js`: `@features`, `@shared`, `@app`, `@routes`, `@styles`, plus `@bienesraices/shared-types` and `@bienesraices/shared-utils`
- AuthContext provides global auth state
- Lazy loading for all routes via React Router v6
- Tailwind CSS for styling (no CSS modules)
- Axios for HTTP with configured baseURL
- Vite locked at 5.3.5 (Rollup native binding compatibility)

## Development Commands

### Root Level (Recommended - uses npm workspaces)

```bash
npm run dev              # Start both frontend and backend concurrently
npm run dev:frontend     # Start only frontend (http://localhost:5173)
npm run dev:backend      # Start only backend (port from .env, default 1234)
npm run build            # Build all workspaces
npm run build:frontend   # Build only frontend
npm run test             # Run all tests in all workspaces
npm run test:frontend    # Run frontend tests
npm run lint             # Lint all workspaces
npm run clean            # Remove all node_modules
npm run install:all      # Install all dependencies
```

### Frontend (`cd apps/frontend/`)

```bash
npm run dev              # Start dev server with Vite
npm run build            # Production build
npm run preview          # Preview production build
npm run lint             # Run ESLint
npm test                 # Run unit tests with Vitest
npm run test:ui          # Run tests with Vitest UI
npm run test:coverage    # Run tests with coverage
npm run test:e2e         # Run Playwright e2e tests
npm run test:e2e:ui      # Run e2e tests with Playwright UI
npm run test:e2e:debug   # Debug e2e tests
```

### Backend (`cd apps/backend/`)

```bash
npm run dev              # Start dev server with nodemon
npm start                # Start production server
npm run db:importar      # Seed database with sample data
npm run db:eliminar      # Clear database seed data
```

## Environment Setup

### Backend `.env` (required in `apps/backend/`)

```env
# Database - MySQL for development
DB_NOMBRE=bienesraices-react
DB_USER=root
DB_PASS=your_password
DB_HOST=localhost

# Database - PostgreSQL for production (Render)
# DATABASE_URL is automatically set by Render, overrides individual DB vars

# URLs
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:1234

# JWT
JWT_SECRET=your_secure_secret_min_32_chars

# Email (Mailtrap for dev, Gmail/other for prod)
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your_mailtrap_user
EMAIL_PASS=your_mailtrap_pass

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Environment
NODE_ENV=development
PORT=1234
```

### Frontend `.env` (required in `apps/frontend/`)

```env
VITE_API_URL=http://localhost:1234
```

**Important:** Both frontend and backend should use port 1234 for the API in development.

## Database

**ORM:** Sequelize with MySQL (development) or PostgreSQL (production)

**Connection:** `apps/backend/config/db.js` - Uses pool (max 5 connections)
- Development: MySQL on port 3306 (uses `DB_NOMBRE`, `DB_USER`, `DB_PASS`, `DB_HOST`)
- Production: PostgreSQL on Render (uses `DATABASE_URL` environment variable)

**Running Migrations:**
Database auto-syncs on server start via `db.sync()` in `server.js`. No separate migration files.

**Seeding:**
```bash
cd apps/backend
npm run db:importar    # Import seed data
npm run db:eliminar    # Remove seed data
```

Seeder file: `apps/backend/seed/seeder.js`

## API Structure

**Base URL:** `http://localhost:1234/api/v1`

**Routes:**
- `/api/health` - Health check endpoint
- `/api/v1/auth` - Authentication (register, login, verify, reset password)
- `/api/v1/properties` - Properties CRUD with search/filters
- `/api/v1/users` - User profile management

**Authentication:** JWT tokens via Passport.js. Protected routes use `passport.authenticate('jwt')` middleware.

## Key Features & Components

### Search & Filters
- `SearchToolbar.jsx` - Main search interface with debounce
- `FilterPanel.jsx` - Advanced filters (price, area, rooms, baths, type)
- `ActiveFiltersBar.jsx` - Removable filter pills
- Multiple view modes: Grid, List, Map

### Property Display
- `PropertyCardPremium.jsx` - Premium card with hover effects
- `PropertyCardHorizontal.jsx` - Horizontal layout for list view
- `GaleriaPropiedad.jsx` - Interactive image gallery with keyboard navigation (←/→)
- `QuickViewModal.jsx` - Quick property preview
- `CompareModal.jsx` - Compare up to 3 properties

### Admin Features
- `MyPropertiesPage.jsx` - User's property dashboard
- `CreatePropertyPage.jsx` / `EditPropertyPage.jsx` - Property CRUD
- `Dropzone.jsx` - Drag & drop image upload
- `FormularioPropiedad.jsx` - Property form with validation

### Authentication
- `AuthContext.jsx` - Global auth state with login/logout/register
- Protected routes via React Router wrapper
- Email verification and password reset flows

## Code Style & Conventions

- **Backend:** ES Modules (`type: "module"` in package.json), Standard.js linting
- **Frontend:** React functional components with hooks, ESLint configured
- **File naming:** PascalCase for React components, camelCase for utilities
- **Import paths:** Use configured aliases (`@features`, `@shared`, etc.) instead of relative paths
- **Shared packages:** TypeScript for type definitions, JavaScript for utilities

## Deployment

### Production Stack
- **Frontend:** Vercel (configured via `vercel.json`)
- **Backend:** Render.com (configured via `render.yaml`)
- **Database:** PostgreSQL on Render (free tier)

### Build Process
- Frontend: Standard Vite build (`npm run build` outputs to `dist/`)
- Backend: No build step required (Node.js runs directly)
- Monorepo: Use workspace-specific commands (`npm run build:frontend`)

### Environment Variables
- Backend on Render: Set `DATABASE_URL`, `FRONTEND_URL`, `JWT_SECRET`, Cloudinary vars
- Frontend on Vercel: Set `VITE_API_URL` to Render backend URL
- See `DEPLOYMENT.md` for detailed deployment instructions

## Common Development Tasks

### Adding a New Backend Route
1. Create controller in `apps/backend/controllers/`
2. Add route in `apps/backend/router/v1/`
3. Import and use in `apps/backend/router/v1/index.js`

### Adding a New Frontend Page
1. Create page in `apps/frontend/src/features/{feature}/pages/`
2. Add lazy-loaded route in `apps/frontend/src/routes/AppRouter.jsx`
3. Use path aliases for imports

### Database Model Changes
1. Modify model in `apps/backend/models/`
2. Restart server (will auto-sync via `db.sync()`)
3. Update seeder if needed (`apps/backend/seed/seeder.js`)

### Image Upload
Backend uses Multer + Cloudinary. Check `apps/backend/middleware/uploadImages.js` for configuration.

### Using Shared Packages
Import shared types and utilities in either frontend or backend:
```javascript
import { PropertyType } from '@bienesraices/shared-types'
import { formatPrice } from '@bienesraices/shared-utils'
```

## Troubleshooting

**CORS errors:** Verify `FRONTEND_URL` in backend `.env` matches frontend dev server URL exactly. Trailing slashes are normalized in `server.js`.

**Database connection fails (dev):** Check MySQL is running and credentials in `apps/backend/.env` match. Default port is 3306.

**Database connection fails (prod):** Verify `DATABASE_URL` is set correctly by Render for PostgreSQL.

**Images not uploading:** Verify Cloudinary credentials in `.env` and check `apps/backend/middleware/uploadImages.js` configuration.

**Frontend 404 on refresh:** Use `BrowserRouter` (already configured). Vite dev server handles this automatically.

**Workspace commands not working:** Run `npm install` at root level to set up workspaces properly.

**Vite build errors:** Vite is locked at 5.3.5 due to Rollup native binding issues. Do not upgrade without testing.

**Shared package not found:** Ensure path aliases are configured correctly in `vite.config.js` and packages are listed in workspace dependencies.

## Testing

### Frontend Testing

**Unit Tests (Vitest):**
- Framework: Vitest with happy-dom environment
- Testing Library: React Testing Library (@testing-library/react)
- Config: `apps/frontend/vitest.config.js`
- Setup: `apps/frontend/src/test/setup.js`
- Coverage: V8 provider with HTML/JSON/text reporters
- Run: `npm test` in frontend directory or `npm run test:frontend` from root

**E2E Tests (Playwright):**
- Framework: Playwright Test
- Config: `apps/frontend/playwright.config.js`
- Test directory: `apps/frontend/e2e/`
- Browsers: Chromium, Firefox, WebKit
- Run: `npm run test:e2e` in frontend directory
- UI mode: `npm run test:e2e:ui` for interactive debugging

**Writing Tests:**
- Unit tests: Place in `__tests__/` directory next to the component
- E2E tests: Place in `apps/frontend/e2e/` directory
- Test files: Use `.test.jsx` or `.spec.jsx` for unit tests, `.spec.js` for e2e
- Sample tests exist in `apps/frontend/src/features/auth/components/__tests__/`

### Backend Testing

No test suite currently configured. Consider Jest + Supertest for API testing.

## Security & Dependency Management

### Last Security Audit: March 25, 2026

**Status:** 24 out of 30 vulnerabilities fixed (80% resolved)

**Automatically Fixed:**
- react-router (XSS via Open Redirects)
- axios (SSRF, DoS vulnerabilities)
- cloudinary (Arbitrary Argument Injection)
- express-rate-limit (IPv4-mapped IPv6 bypass)
- sequelize (SQL Injection)
- Plus 19+ other packages (ajv, cross-spawn, dottie, flatted, form-data, glob, js-yaml, jws, minimatch, path-to-regexp, qs, rollup, underscore, etc.)

**Remaining Vulnerabilities (6):**

1. **esbuild/vite** (2 moderate severity)
   - Issue: Development server request vulnerability
   - Status: Accepted - Vite locked at 5.3.5 per project requirements (Rollup native binding compatibility)
   - Impact: Development only, not a production concern
   - Action: No fix required

2. **nodemailer** (2 high severity)
   - Issue: Email domain confusion & DoS via recursive calls
   - Current: v7.x (vulnerable)
   - Fix: Upgrade to v8.0.4 (breaking change)
   - Command: `npm install nodemailer@8.0.4 -w @bienesraices/backend`
   - Testing: Verify email sending functionality after upgrade
   - Priority: Medium (affects email verification & password reset features)

3. **tar/bcrypt** (4 high severity)
   - Issue: Path traversal vulnerabilities in tar package (affects bcrypt installation)
   - Current: bcrypt v5.x (depends on vulnerable tar)
   - Fix: Upgrade to bcrypt v6.0.0 (breaking change)
   - Command: `npm install bcrypt@6.0.0 -w @bienesraices/backend`
   - Testing: Verify password hashing/verification in authentication flows
   - Priority: Medium (affects user authentication)

### Running Security Audits

```bash
# Check for vulnerabilities
npm audit

# Fix non-breaking vulnerabilities
npm audit fix

# Fix all vulnerabilities (including breaking changes)
npm audit fix --force  # Use with caution, test thoroughly after
```

### Dependency Update Best Practices

1. **Before updating:**
   - Review breaking changes in package changelogs
   - Check if updates affect locked dependencies (Vite 5.3.5)
   - Ensure `mysql2` package is installed for backend

2. **After updating:**
   - Run `npm run build:frontend` to verify frontend builds
   - Start backend with `npm run dev:backend` to verify it connects to database
   - Test affected features (email, authentication, file uploads)
   - Run test suite: `npm run test:frontend`

3. **Critical dependencies to monitor:**
   - `vite` - Keep at 5.3.5 (do not upgrade)
   - `mysql2` - Required for Sequelize (may be removed during cleanup)
   - `nodemailer` - High severity vulnerabilities (upgrade when ready)
   - `bcrypt` - High severity vulnerabilities (upgrade when ready)
