# 🏗️ Optimización de Arquitectura Frontend

## 📊 Análisis de Arquitectura Actual

### Estructura Actual (Híbrida)
```
src/
├── components/          # Componentes compartidos (mezclados)
│   ├── Footer/
│   ├── Header/
│   ├── Mapa/
│   ├── LogoUploader/
│   └── FormularioContacto/
├── pages/              # Páginas por dominio
│   ├── Admin/
│   ├── auth/
│   ├── Inicio/
│   ├── Propiedad/
│   └── Propiedades/
├── context/            # Contextos de React
├── hooks/              # Custom hooks
├── routes/             # Configuración de rutas
├── utils/              # Utilidades
└── icons/              # Iconos
```

### ❌ Problemas Identificados

1. **Inconsistencia en nomenclatura**
   - Mezcla español/inglés: `Propiedad` vs `Admin`
   - Archivos sin index barrel: `Inicio/Inicio.jsx` debería ser `Inicio/index.jsx`

2. **Componentes mal organizados**
   - `components/` mezcla globales con específicos de features
   - No hay separación clara entre UI y lógica de negocio

3. **Falta de capas**
   - No hay capa de servicios/API centralizada
   - No hay constantes/configuración separada
   - No hay types/interfaces (si usáramos TS)

4. **Estructura de componentes inconsistente**
   - Algunos tienen CSS, otros no
   - Algunos tienen barrel exports, otros no

5. **Escalabilidad limitada**
   - Difícil agregar nuevas features sin contaminar carpetas existentes

---

## ✅ Arquitectura Propuesta: Feature-Sliced Design (Lite)

### Principios

1. **Por Feature/Dominio** en lugar de por tipo técnico
2. **Componentes coubicados** con sus dependencias (styles, tests, hooks)
3. **Barrel exports** para APIs limpias
4. **Separación de capas** (UI, lógica, datos)
5. **Nomenclatura consistente** en inglés

### Nueva Estructura

```
src/
├── app/                          # Configuración de aplicación
│   ├── App.jsx
│   ├── main.jsx
│   └── providers/
│       └── AppProviders.jsx      # Wrappers de contextos
│
├── features/                     # Features del negocio
│   ├── auth/                     # Autenticación
│   │   ├── components/
│   │   │   ├── LoginForm/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── index.js
│   │   │   ├── RegisterForm/
│   │   │   ├── FormInput/
│   │   │   └── FormButton/
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── authService.js
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── ForgotPasswordPage.jsx
│   │   └── index.js
│   │
│   ├── properties/               # Propiedades (Core)
│   │   ├── components/
│   │   │   ├── PropertyCard/
│   │   │   │   ├── PropertyCard.jsx
│   │   │   │   ├── PropertyCard.module.css
│   │   │   │   └── index.js
│   │   │   ├── PropertyCardPremium/
│   │   │   ├── PropertyGrid/
│   │   │   ├── PropertyFilters/
│   │   │   │   ├── SearchToolbar/
│   │   │   │   ├── FilterPanel/
│   │   │   │   ├── PriceRangeSlider/
│   │   │   │   └── AreaRangeSlider/
│   │   │   ├── PropertyGallery/
│   │   │   ├── PropertyMap/
│   │   │   └── PropertyComparison/
│   │   │       ├── CompareBar.jsx
│   │   │       └── CompareModal.jsx
│   │   ├── hooks/
│   │   │   ├── useProperties.js
│   │   │   ├── usePropertyFilters.js
│   │   │   └── usePropertyComparison.js
│   │   ├── services/
│   │   │   └── propertyService.js
│   │   ├── pages/
│   │   │   ├── PropertiesListPage.jsx
│   │   │   ├── PropertyDetailPage.jsx
│   │   │   └── PropertySearchPage.jsx
│   │   ├── utils/
│   │   │   └── propertyHelpers.js
│   │   └── index.js
│   │
│   ├── admin/                    # Panel de administración
│   │   ├── components/
│   │   │   ├── PropertyForm/
│   │   │   ├── ImageUploader/
│   │   │   ├── DashboardStats/
│   │   │   └── PropertiesTable/
│   │   ├── hooks/
│   │   │   └── usePropertyForm.js
│   │   ├── services/
│   │   │   └── adminService.js
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── CreatePropertyPage.jsx
│   │   │   ├── EditPropertyPage.jsx
│   │   │   └── MyPropertiesPage.jsx
│   │   └── index.js
│   │
│   ├── user/                     # Perfil de usuario
│   │   ├── components/
│   │   │   └── ProfileForm/
│   │   ├── pages/
│   │   │   └── ProfilePage.jsx
│   │   ├── services/
│   │   │   └── userService.js
│   │   └── index.js
│   │
│   └── home/                     # Página inicio
│       ├── components/
│       │   ├── Hero/
│       │   ├── FeaturedProperties/
│       │   ├── CategoryCards/
│       │   └── SearchBar/
│       ├── pages/
│       │   └── HomePage.jsx
│       └── index.js
│
├── shared/                       # Compartido entre features
│   ├── components/               # Componentes UI reutilizables
│   │   ├── ui/                   # Componentes puros UI
│   │   │   ├── Button/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Button.module.css
│   │   │   │   └── index.js
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   ├── Card/
│   │   │   ├── Badge/
│   │   │   └── Spinner/
│   │   ├── layout/               # Componentes de layout
│   │   │   ├── Header/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Header.css
│   │   │   │   ├── UserMenu.jsx
│   │   │   │   └── index.js
│   │   │   ├── Footer/
│   │   │   ├── Sidebar/
│   │   │   └── Container/
│   │   └── feedback/             # Feedback al usuario
│   │       ├── Toast/
│   │       ├── Alert/
│   │       └── LoadingScreen/
│   │
│   ├── hooks/                    # Hooks compartidos
│   │   ├── useForm.js
│   │   ├── useDebounce.js
│   │   ├── useLocalStorage.js
│   │   └── useMediaQuery.js
│   │
│   ├── utils/                    # Utilidades generales
│   │   ├── formatters.js         # Formato de números, fechas, etc.
│   │   ├── validators.js         # Validaciones
│   │   ├── helpers.js            # Funciones auxiliares
│   │   └── constants.js          # Constantes globales
│   │
│   ├── services/                 # Capa de servicios
│   │   ├── api/
│   │   │   ├── axios.config.js   # Configuración axios
│   │   │   ├── endpoints.js      # URLs de endpoints
│   │   │   └── interceptors.js   # Interceptores
│   │   └── storage/
│   │       └── localStorage.js
│   │
│   ├── config/                   # Configuración
│   │   ├── env.js                # Variables de entorno
│   │   ├── routes.js             # Rutas de la app
│   │   └── theme.js              # Tema (colores, breakpoints)
│   │
│   └── assets/                   # Assets estáticos
│       ├── images/
│       ├── icons/
│       └── fonts/
│
├── routes/                       # Configuración de routing
│   ├── AppRouter.jsx
│   ├── PrivateRoute.jsx
│   ├── routes.config.js          # Configuración centralizada
│   └── index.js
│
└── styles/                       # Estilos globales
    ├── index.css                 # Importación principal
    ├── reset.css                 # Reset CSS
    ├── variables.css             # Variables CSS
    └── utilities.css             # Clases utilitarias
```

---

## 🎯 Beneficios de la Nueva Arquitectura

### 1. Escalabilidad
- Fácil agregar nuevas features sin afectar existentes
- Cada feature es autocontenida

### 2. Mantenibilidad
- Todo relacionado a una feature está junto
- Fácil encontrar y modificar código

### 3. Reutilización
- Componentes compartidos bien definidos
- Hooks y utils centralizados

### 4. Consistencia
- Nomenclatura en inglés
- Estructura repetible por feature
- Barrel exports en todos los módulos

### 5. Testing
- Fácil testear features de forma aislada
- Mocks más simples

### 6. Colaboración
- Múltiples devs pueden trabajar en features distintas sin conflictos
- Onboarding más rápido

---

## 📝 Convenciones de Nomenclatura

### Archivos

```
✓ PascalCase para componentes:    PropertyCard.jsx
✓ camelCase para hooks:            usePropertyFilters.js
✓ camelCase para utils:            formatPrice.js
✓ camelCase para services:         propertyService.js
✓ kebab-case para estilos:         property-card.module.css
✓ UPPER_SNAKE para constantes:    API_ENDPOINTS.js
```

### Carpetas

```
✓ kebab-case para features:        properties/, user-profile/
✓ camelCase para subcarpetas:      components/, hooks/, services/
✓ PascalCase para componentes:     PropertyCard/, SearchBar/
```

### Barrel Exports (index.js)

Cada carpeta de componente debe tener un `index.js`:

```javascript
// ✓ CORRECTO
// components/PropertyCard/index.js
export { default } from './PropertyCard';
export { PropertyCardSkeleton } from './PropertyCard';

// Uso
import PropertyCard from '@/features/properties/components/PropertyCard';
```

---

## 🔄 Plan de Migración

### Fase 1: Preparación (Sin romper nada)
1. Crear nueva estructura de carpetas vacía
2. Configurar alias de paths en vite.config.js
3. Crear barrel exports

### Fase 2: Migración por Feature
1. **auth** (más simple, buen punto de inicio)
2. **home** (página de inicio)
3. **properties** (feature principal, más complejo)
4. **admin** (panel de administración)
5. **user** (perfil)

### Fase 3: Shared/Common
1. Mover componentes a shared/components
2. Extraer hooks compartidos
3. Centralizar servicios y utils

### Fase 4: Limpieza
1. Eliminar carpetas antiguas
2. Actualizar imports
3. Verificar build

---

## 🛠️ Configuración Necesaria

### vite.config.js - Alias de paths

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@features': path.resolve(__dirname, './src/features'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@app': path.resolve(__dirname, './src/app'),
      '@routes': path.resolve(__dirname, './src/routes'),
      '@styles': path.resolve(__dirname, './src/styles'),
    },
  },
});
```

### Uso de Alias

```javascript
// ❌ Antes
import PropertyCard from '../../pages/Propiedades/components/CardPropiedad';

// ✅ Después
import PropertyCard from '@features/properties/components/PropertyCard';
import { Button } from '@shared/components/ui/Button';
import { useAuth } from '@features/auth/hooks/useAuth';
```

---

## 📦 Ejemplo Completo: Feature "properties"

```
features/properties/
├── components/
│   ├── PropertyCard/
│   │   ├── PropertyCard.jsx
│   │   ├── PropertyCard.module.css
│   │   ├── PropertyCardSkeleton.jsx
│   │   └── index.js
│   │
│   ├── PropertyFilters/
│   │   ├── PropertyFilters.jsx
│   │   ├── SearchToolbar.jsx
│   │   ├── FilterPanel.jsx
│   │   ├── PriceRangeSlider.jsx
│   │   └── index.js
│   │
│   └── PropertyGallery/
│       ├── PropertyGallery.jsx
│       ├── GalleryModal.jsx
│       ├── ImageGalleryHover.jsx
│       └── index.js
│
├── hooks/
│   ├── useProperties.js          # Hook para fetch de propiedades
│   ├── usePropertyFilters.js     # Hook para filtros
│   ├── usePropertyDetail.js      # Hook para detalle
│   └── index.js
│
├── services/
│   └── propertyService.js        # API calls
│
├── pages/
│   ├── PropertiesListPage.jsx    # /propiedades
│   ├── PropertyDetailPage.jsx    # /propiedades/:id
│   └── index.js
│
├── utils/
│   └── propertyHelpers.js        # Funciones específicas
│
└── index.js                      # Barrel export del feature
```

---

## ✅ Checklist de Implementación

### Por cada Feature
- [ ] Crear estructura de carpetas
- [ ] Crear barrel exports (index.js)
- [ ] Mover componentes
- [ ] Actualizar imports
- [ ] Mover hooks específicos
- [ ] Crear/mover services
- [ ] Mover páginas
- [ ] Actualizar rutas
- [ ] Verificar que compile
- [ ] Testing

### Global
- [ ] Configurar alias de paths
- [ ] Crear shared/components/ui
- [ ] Crear shared/hooks
- [ ] Centralizar shared/utils
- [ ] Centralizar shared/services
- [ ] Crear shared/config
- [ ] Actualizar todos los imports
- [ ] Build de producción exitoso
- [ ] Documentar cambios

---

## 🚀 Resultado Esperado

### Antes (Actual)
```javascript
// Import caótico
import PropertyCard from '../../../pages/Propiedades/components/CardPropiedad';
import useForm from '../../../hooks/useForm';
import api from '../../../utils/axiosConfig';
```

### Después (Optimizado)
```javascript
// Imports limpios y predecibles
import { PropertyCard } from '@features/properties/components/PropertyCard';
import { useForm } from '@shared/hooks/useForm';
import { api } from '@shared/services/api';
```

### Estructura Mental Clara
```
"¿Dónde está el componente de login?"
→ features/auth/components/LoginForm/

"¿Dónde están los filtros de búsqueda?"
→ features/properties/components/PropertyFilters/

"¿Dónde está el botón compartido?"
→ shared/components/ui/Button/
```

---

## 📚 Referencias

- **Feature-Sliced Design**: https://feature-sliced.design/
- **React Folder Structure**: https://react.dev/learn/thinking-in-react
- **Clean Architecture**: https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html

---

**¿Proceder con la migración?**
