# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack real estate platform for buying, selling, and renting properties. React + Vite frontend with Express.js backend using MySQL/Sequelize ORM. Features advanced search, image galleries, authentication, and admin dashboard.

## Project Structure

This is a monorepo with two main directories:

- `front/` - React 18.3 + Vite 5.4 + Tailwind CSS frontend
- `back/` - Express.js + Sequelize + MySQL backend

### Backend Architecture (`back/`)

```
back/
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

### Frontend Architecture (`front/`)

```
front/src/
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
└── App.jsx
```

**Key Frontend Patterns:**
- Feature-based folder structure (not component-based)
- Path aliases configured in `vite.config.js`: `@features`, `@shared`, `@app`, `@routes`
- AuthContext provides global auth state
- Lazy loading for all routes via React Router v6
- Tailwind CSS for styling (no CSS modules)
- Axios for HTTP with configured baseURL

## Development Commands

### Frontend (`cd front/`)

```bash
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend (`cd back/`)

```bash
npm start               # Start production server (port from .env, default 1234)
npm run db:importar     # Seed database with sample data
npm run db:eliminar     # Clear database seed data
```

**Note:** Backend uses `node server.js` directly (no nodemon in package.json for dev mode).

## Environment Setup

### Backend `.env` (required)

```env
# Database
DB_NOMBRE=bienesraices-react
DB_USER=root
DB_PASS=your_password
DB_HOST=localhost

# URLs
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:1234

# JWT
JWT_SECRET=your_secure_secret_min_32_chars

# Email (Mailtrap for dev)
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

### Frontend `.env` (required)

```env
VITE_API_URL=http://localhost:3000
```

**Important:** Backend runs on port 1234 by default, but frontend `.env` points to port 3000. Verify correct ports when debugging.

## Database

**ORM:** Sequelize with MySQL (port 3306)

**Connection:** `back/config/db.js` - Uses pool (max 5 connections)

**Running Migrations:**
Database auto-syncs on server start via `db.sync()` in `server.js`. No separate migration files.

**Seeding:**
```bash
cd back
npm run db:importar    # Import seed data
npm run db:eliminar    # Remove seed data
```

Seeder file: `back/seed/seeder.js`

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
- **No TypeScript:** Pure JavaScript project

## Common Development Tasks

### Adding a New Backend Route
1. Create controller in `back/controllers/`
2. Add route in `back/router/v1/`
3. Import and use in `back/router/v1/index.js`

### Adding a New Frontend Page
1. Create page in `front/src/features/{feature}/pages/`
2. Add lazy-loaded route in `front/src/routes/AppRouter.jsx`
3. Use path aliases for imports

### Database Model Changes
1. Modify model in `back/models/`
2. Restart server (will auto-sync via `db.sync()`)
3. Update seeder if needed (`back/seed/seeder.js`)

### Image Upload
Backend uses Multer + Cloudinary. Check `back/middleware/uploadImages.js` for configuration.

## Troubleshooting

**CORS errors:** Verify `FRONTEND_URL` in backend `.env` matches frontend dev server URL exactly (including trailing slashes handled in `server.js`).

**Database connection fails:** Check MySQL is running and credentials in `.env` match. Default port is 3306.

**Images not uploading:** Verify Cloudinary credentials in `.env` and check `uploadImages.js` middleware configuration.

**Frontend 404 on refresh:** Use `BrowserRouter` (already configured). Vite dev server handles this automatically.

## Testing

No test suite currently configured. When adding tests:
- Backend: Consider Jest + Supertest for API testing
- Frontend: React Testing Library + Vitest recommended (Vite-native)
