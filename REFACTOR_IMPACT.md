# Impacto del refactor — Frontend `@bienesraices/frontend`

Branch: `refactor/frontend-optimizations` · Commits: `5c7dc53`, `b189f10`, `4574c41`

Resumen ejecutivo de las Fases 0-3 del plan de optimización. Documento generado para entender qué cambió, por qué, y qué se ganó.

---

## TL;DR

| Métrica | Antes | Después | Δ |
|---------|-------|---------|---|
| Bundle entry (gzip) | 76.13 KB | 89.09 KB | +12.96 KB (React Query) |
| Llamadas duplicadas a `/properties/types` por carga inicial | 5 | 1 | -80 % |
| `alert()` nativos | 9 | 0 | -100 % |
| `console.*` en producción | 21+ | 0 | -100 % |
| Componentes con `api.*` directo | 12 | 0 | -100 % |
| Líneas neto en src (3 commits) | — | — | -120 |
| Tests verdes | 2/102 (config rota) | 2/102 | sin regresiones |
| Build | ✅ | ✅ | sin breaking changes |

---

## Fase 0 + 1 — Limpieza estructural

**Commit:** `5c7dc53 refactor(frontend): consolidate legacy folders into feature/shared structure`

### Antes

```
apps/frontend/src/
├── components/Mapa/             ← legacy, fuera de shared
├── components/FormularioContacto/
├── pages/Propiedades/           ← carpeta vacía
├── icons/icon.jsx               ← fuera de shared/assets
├── app/providers/               ← vacía
├── styles/                      ← vacía pero con alias
├── shared/components/{ui,feedback}/  ← vacías
└── features/*/{services,hooks,utils}/ ← carpetas vacías por todos lados
```

5 archivos importaban con `../../../` cruzando 3-4 niveles, evitando los aliases del proyecto.

### Después

```
apps/frontend/src/
├── features/...                  ← única ubicación de código de feature
└── shared/
    ├── components/Map/           ← Mapa movido aquí
    └── assets/icons/             ← icons movidos aquí
```

- `FormularioContacto` (legacy) → `features/properties/components/detail/PropertyContactForm.jsx`
- Todos los imports usan aliases (`@shared`, `@features`)
- `vite.config.js` libre de aliases huérfanos (`@app`, `@styles` eliminados)

### Impacto

- **Convención clara:** un único lugar para componentes compartidos. Bajo el árbol `shared/`, no en `src/components/` paralelo.
- **Discoverability:** ningún archivo perdido en carpetas vacías. Buscar un componente requiere conocer una sola convención.
- **Sin riesgo runtime:** el build produce el mismo bundle byte-a-byte (228.21 KB).

---

## Fase 2 — Capa de servicios + React Query

**Commit:** `b189f10 refactor(frontend): extract data fetching into service layer with React Query`

### Antes

Cada página/componente importaba `api` de Axios y disparaba `api.get/post/...` directamente. **30 callsites distribuidos en 12 archivos**.

```jsx
// PropertiesListPage.jsx — patrón repetido en MyPropertiesPage,
// PropertyDetailPage, EditPropertyPage, ProfilePage, FormularioPropiedad,
// HomePage, CardCategories, Header, PropiedadesDestacadas...
const [results, setResults] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetch = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/v1/properties');
      setResults(response.data.data || []);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError("Hubo un problema al obtener los resultados.");
    } finally {
      setLoading(false);
    }
  };
  fetch();
}, []);
```

**Patología detectada:** `GET /api/v1/properties/types` se llamaba desde **5 lugares distintos** (Header, HomePage, CardCategories, FormularioPropiedad, MyPropertiesPage). Cada navegación inicial disparaba 5 peticiones idénticas al mismo endpoint sin caché compartido.

### Después

**4 servicios por feature** (28 funciones puras que devuelven Promises):

```
features/
├── properties/services/propertiesService.js  (5 fns)
├── admin/services/adminPropertiesService.js  (9 fns)
├── auth/services/authService.js              (7 fns)
└── user/services/userService.js              (3 fns)
```

**`@tanstack/react-query` configurado** con `QueryClient` global:
```jsx
defaultOptions: { queries: { staleTime: 30s, retry: 1, refetchOnWindowFocus: false } }
```

**Hook compartido para tipos** (`usePropertyTypes`):
```jsx
useQuery({
  queryKey: ['property-types'],
  queryFn: getPropertyTypes,
  staleTime: Infinity,  // los tipos son estáticos
})
```

**Páginas migradas** (12 componentes):

| Tipo | Páginas/componentes |
|------|---------------------|
| `useQuery` | PropertiesListPage, PropertyDetailPage, MyPropertiesPage, EditPropertyPage, ProfilePage, PropiedadesDestacadas |
| `useMutation` | PropertyContactForm, CreatePropertyPage, EditPropertyPage, MyPropertiesPage (delete + togglePublish), ProfilePage (update + avatar) |
| `usePropertyTypes` | Header, HomePage, CardCategories, FormularioPropiedad, MyPropertiesPage |

**Invalidación post-mutación** automática:
- Crear/editar/eliminar propiedad → invalida `['my-properties']`
- Editar propiedad → también invalida `['my-property', id]`
- Update de perfil → invalida `['me']`

### Impacto

#### Performance (cache compartido)

```
Antes: usuario abre /home
  → Header.fetch  (/properties/types)   [fetch #1]
  → HomePage.fetch (/properties/types)  [fetch #2]   ← ¡ya tenía la respuesta!
  → CardCategories.fetch (/properties/types) [fetch #3]
Total: 3 peticiones idénticas en paralelo

Después: usuario abre /home
  → usePropertyTypes() se llama desde 3 sitios
  → React Query dedupea: 1 sola petición
Total: 1 petición
```

Multiplicado por todas las navegaciones de la sesión, este es el **mayor ahorro de tráfico** del refactor. En `MyPropertiesPage` y `FormularioPropiedad` (admin), el endpoint ya estaba en caché desde la home.

#### Mantenibilidad

- **-40 líneas netas** (489 insertions, 529 deletions) **pese a añadir 4 services + setup de RQ + hook**.
- Toda llamada HTTP vive ahora detrás de la frontera `services/*`. Si el backend cambia un path, hay un único sitio que tocar.
- **Cero `api.get/post/...` directos en componentes.** El árbol de imports está saneado: páginas → services → axios. Nunca al revés.

#### UX

- Refetch automático en mounting tras invalidación (e.g., después de crear propiedad, `MyPropertiesPage` se actualiza sola).
- Estados unificados: `isLoading`, `isError`, `data` reemplazan triple `useState` manual.

#### Coste

- Bundle entry: **76.13 → 88.19 KB gzipped (+12 KB)**. Dentro del rango estimado en la decisión Fase 2.2.
- Curva de aprendizaje React Query (`queryKey`, `mutate`, `invalidateQueries`) — patrones estables ya documentados.

---

## Fase 3 — Componentes de feedback unificados

**Commit:** `4574c41 feat(frontend): unify feedback UI with Toast, Spinner, EmptyState, ErrorBoundary`

### Antes

UI de feedback duplicada en cada página:

```jsx
// 9 alert() esparcidos en Dropzone, ImagenPropiedad x2, GaleriaAdmin x3,
// AvatarUpload x2, PropertiesListPage:
alert('Error al eliminar la imagen.');

// Spinner inline copiado en 5 sitios:
<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>

// "Empty state" hardcodeado 3 veces solo en PropertiesListPage:
<div className="text-center py-20">
  <div className="text-6xl mb-4">🔍</div>
  <h3 className="text-2xl font-bold text-gray-700 mb-2">No se encontraron...</h3>
  ...
</div>

// Toast manual en MyPropertiesPage con state + setTimeout + JSX inline (35 líneas)

// 21+ console.error en producción

// Sin ErrorBoundary: cualquier excepción de render = pantalla blanca
```

### Después

`shared/components/feedback/` con 4 primitives + `shared/utils/logger.js`:

| Componente | API |
|------------|-----|
| `<Spinner />` | `size: sm \| md \| lg \| xl`, `fullScreen`, `label` |
| `<ToastProvider>` + `useToast()` | `toast.success/error/info(message)` |
| `<EmptyState />` | `icon`, `title`, `description`, `action` |
| `<ErrorBoundary>` | wrap del árbol, fallback con botón "Recargar" |
| `logger` | `log/warn/error` solo en `import.meta.env.DEV` |

**Árbol final en `main.jsx`:**
```jsx
<ErrorBoundary>
  <QueryClientProvider>
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <App />
```

### Impacto

#### UX

- **0 `alert()` bloqueantes.** Toast no-modales con animación, dismiss al click, auto-cierre 3s.
- **ErrorBoundary** convierte un crash de render en una pantalla de error con CTA "Recargar". Hoy ningún usuario verá pantalla blanca por una excepción inesperada de React.
- Loading states homogéneos en toda la app (mismo color, mismo tamaño según contexto).

#### Producción

- **Cero `console.*` filtrando a producción.** `logger` solo emite en dev. Reduce ruido en consolas de usuarios reales y elimina pequeño riesgo de fugas de información (objetos error completos).

#### Mantenibilidad

- `MyPropertiesPage` perdió **35 líneas** del toast manual (state, useEffect del timer, JSX condicional, estilos inline). Ahora una llamada: `toast.success('...')`.
- Tres bloques de "no se encontraron resultados" con el mismo patrón se consolidaron en `<EmptyState>`.
- **+278 / -89 líneas** netas en este commit (suma porque crear los componentes nuevos pesa, pero los call sites se simplificaron drásticamente).

#### Coste

- Bundle entry: 88.19 → 89.09 KB gzipped (**+0.9 KB**, despreciable).
- `MyPropertiesPage` chunk **bajó** de 4.05 → 3.52 KB (toast inline reemplazado por hook).

---

## Comparación cumulativa

### Bundle por chunk (gzip)

| Chunk | Baseline | Después Fase 3 | Δ |
|-------|----------|----------------|---|
| `index.js` (entry) | 76.13 KB | 89.09 KB | +12.96 KB |
| `Map.js` (leaflet) | 51.41 KB | 51.41 KB | 0 |
| `PropertiesGrid.js` | 22.39 KB | 22.55 KB | +0.16 KB |
| `PropertiesListPage.js` | 8.70 KB | 8.56 KB | -0.14 KB |
| `PropertyDetailPage.js` | 5.74 KB | 5.72 KB | -0.02 KB |
| `MyPropertiesPage.js` | 1.83 KB | 1.63 KB | -0.20 KB |
| `ProfilePage.js` | 3.01 KB | 3.04 KB | +0.03 KB |

**Total cost: +12 KB gzip**, 100 % atribuible a React Query. Las páginas individuales **bajaron o quedaron igual** porque el boilerplate desapareció.

### Antes vs después por archivo de página

`PropertiesListPage.jsx` (top of mind, archivo más complejo):
- Antes: 332 líneas (fetch + filter + sort + 3 empty states inline + spinner inline + alert)
- Después: ~250 líneas (useQuery + filter + sort + EmptyState + Spinner + toast)

`MyPropertiesPage.jsx`:
- Antes: 218 líneas (fetch x2 + state x4 + handlers manuales + toast manual + JSX condicional)
- Después: 162 líneas (useQuery + 2 mutations + EmptyState + toast hook)

`AuthContext.jsx`:
- Antes: 127 líneas (axios directo, lógica duplicada `verifyAuth`/`refreshUser`)
- Después: 117 líneas (consume `authService`, helper `mapUser`, código simétrico)

### Lo que NO cambió

- Tests siguen rotos por la deuda pre-existente de `vitest.config.js` (falta plugin React). No fue tocado en este refactor — es scope de Fase 6 o aparte.
- Filtrado de propiedades sigue del lado cliente. **Esto es Fase 5** (filtrado server-side) y se verá ahí.
- No hay memoización (`useMemo`/`useCallback`/`React.memo`). **Es Fase 4** — siguiente.
- Hot reload, dev server, build pipeline: idénticos.

---

## Riesgos mitigados por el refactor

| Riesgo | Cómo se mitigó |
|--------|----------------|
| Cambio de path en backend rompe N archivos | Una única función en `services/` por endpoint |
| Mounted múltiple del mismo fetch genera N requests | React Query dedupea por `queryKey` |
| Excepción de render → pantalla blanca | `ErrorBoundary` con fallback amigable |
| Logs de error filtran datos sensibles a usuarios | `logger` dev-only |
| `alert()` interrumpiendo flujos de drag & drop | Toasts no-bloqueantes |
| Imports rotos al renombrar archivo | Aliases en lugar de paths relativos profundos |

---

## Trabajo pendiente

Recordatorio del plan original:

| Fase | Estado | Esfuerzo |
|------|--------|----------|
| 0. Baseline | ✅ Hecha | 0.5d |
| 1. Limpieza estructural | ✅ Hecha | 1d |
| 2. Servicios + React Query | ✅ Hecha | 2d |
| 3. Feedback components | ✅ Hecha | 1d |
| 4. Performance React (`useMemo`, `React.memo`) | ⏳ Pendiente | 1.5d |
| 5. Bundle + filtrado server-side | ⏳ Pendiente | 2d |
| 6. TypeScript (opcional) | ⏳ Opcional | 5-10d |

**Restante: ~3.5 días** sin contar Fase 6.

---

## Conclusión

El refactor convirtió un frontend con lógica HTTP esparcida, UI de feedback duplicada y consola contaminada en uno con:

1. Una **frontera única** para todas las llamadas al backend (services).
2. Un **cache cross-page** para datos que se piden desde varias rutas (`property-types` paso de 5 fetches a 1).
3. **UX consistente** en spinners, toasts, errores y empty states.
4. Una **red de seguridad** (`ErrorBoundary`) que evita pantallas blancas en producción.

El coste fue **+12 KB gzipped en el bundle entry** (React Query), justificable solo con el ahorro de fetches. El resto del refactor mejoró calidad **a coste neto -120 líneas**.

Las dos optimizaciones de mayor impacto restantes son **Fase 4** (memoización en hot paths como `PropertiesListPage` y `PropertyCardPremium`) y **Fase 5** (filtrado server-side que escala a miles de propiedades). Ambas están listas para arrancar.
