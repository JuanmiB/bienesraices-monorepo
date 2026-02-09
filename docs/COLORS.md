# 🎨 Paleta de Colores del Proyecto

**Última actualización:** 6 de Febrero de 2026
**Estado:** ✅ Implementado y verificado

---

## Paleta Actual

Paleta personalizada de 6 colores con tonos terrosos y elegantes que reemplazó el esquema indigo original.

### Colores Principales

| Color | Hex | Nombre | Uso |
|-------|-----|--------|-----|
| **Primary** | `#AD4E1A` | Funky Monkey | Color principal, botones, enlaces, precios |
| **Neutral** | `#CCC4AE` | Bauhaus Tan | Backgrounds neutros, cards secundarios |
| **Dark** | `#191F45` | Konkikyō Blue | Textos oscuros, header, footer |
| **Light** | `#F3ECEA` | Bunny Hop | Background principal, cards claros |
| **Secondary** | `#A3BDD3` | Angel Falls | Acentos secundarios, info cards |
| **Tertiary** | `#24547D` | Blueberry Twist | Links secundarios, badges |

### Variantes

Cada color tiene 10 variantes (50-900) para máxima flexibilidad:

```css
primary-50: #FDF6F3    (Muy claro)
primary-100: #FAEEE7
primary-200: #F4D5C4
primary-300: #EEBCA1
primary-400: #D9885B
primary-500: #AD4E1A   (DEFAULT)
primary-600: #8A3E15
primary-700: #672E10
primary-800: #451F0B
primary-900: #220F05   (Muy oscuro)
```

---

## Configuración

### CSS Variables (`front/src/index.css`)

```css
:root {
    --color-primary: #AD4E1A;
    --color-primary-dark: #8A3E15;
    --color-primary-light: #C96A2F;
    --color-neutral: #CCC4AE;
    --color-dark: #191F45;
    --color-light: #F3ECEA;
    --color-secondary: #A3BDD3;
    --color-tertiary: #24547D;
}

body {
    background-color: var(--color-light);
}
```

### Tailwind Config (`front/tailwind.config.js`)

Las 6 colores están definidos en `theme.extend.colors` con 10 variantes cada uno.

---

## Uso en Código

### Clases Tailwind

```jsx
// Botones primarios
<button className="bg-primary-600 hover:bg-primary-700 text-white">
  Acción Principal
</button>

// Precios
<p className="text-primary-600 font-bold text-3xl">
  USD 250,000
</p>

// Badges
<span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full">
  Destacado
</span>

// Links
<a className="text-primary-600 hover:text-primary-700 underline">
  Ver más
</a>

// Inputs con focus
<input className="border focus:border-primary-500 focus:ring-primary-500" />

// Backgrounds neutros
<div className="bg-neutral-100 border-neutral-300">Card</div>

// Header/Footer oscuros
<header className="bg-dark text-white">Header</header>
```

### CSS Variables

```css
.custom-element {
  background-color: var(--color-primary);
  color: var(--color-light);
  border: 1px solid var(--color-neutral);
}
```

---

## Migración desde Indigo

### Antes (Indigo - Azul Violeta)

```jsx
className="bg-indigo-600 hover:bg-indigo-700 text-white"
className="text-indigo-600 hover:text-indigo-700"
className="bg-indigo-50 text-indigo-700"
className="focus:ring-indigo-500"
```

### Después (Primary - Terracota)

```jsx
className="bg-primary-600 hover:bg-primary-700 text-white"
className="text-primary-600 hover:text-primary-700"
className="bg-primary-50 text-primary-700"
className="focus:ring-primary-500"
```

**Archivos modificados:** 28 componentes JSX + 2 archivos de configuración

---

## Elementos Visuales Actualizados

| Elemento | Color Anterior | Color Actual | Hex |
|----------|---------------|--------------|-----|
| Botones principales | Indigo 600 | Primary 600 | #8A3E15 |
| Precios | Indigo 600 | Primary 600 | #8A3E15 |
| Enlaces hover | Indigo 600 | Primary 600 | #8A3E15 |
| Focus rings | Indigo 500 | Primary 500 | #AD4E1A |
| Badges activos | Indigo 50/700 | Primary 50/700 | #FDF6F3/#672E10 |
| Slider tracks | Indigo 400 | Primary 500 | #AD4E1A |
| Slider thumbs | Indigo 500 | Primary 600 | #8A3E15 |

---

## Filosofía de la Paleta

La paleta transmite:

- **Calidez y confianza** (terracota) - Color primario que genera cercanía
- **Elegancia neutral** (beige/crema) - Sofisticación sin saturación
- **Profesionalismo** (navy profundo) - Seriedad y estabilidad
- **Limpieza y amplitud** (off-white) - Espacios respirables
- **Serenidad** (azul pastel) - Calma para información secundaria
- **Solidez** (teal) - Confiabilidad en elementos terciarios

**Perfecta para una plataforma de bienes raíces moderna y premium.**

---

## Verificación Técnica

### Build Status
```bash
✓ Build exitoso
✓ 0 referencias a `indigo-` en código fuente
✓ Todas las variantes Tailwind generadas correctamente
✓ RGB values coinciden con hex esperados
✓ Estados hover/focus/active funcionando
```

### Compatibilidad
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Responsive (mobile, tablet, desktop)

### Accesibilidad
- ✅ Contraste WCAG AA cumplido en combinaciones de texto/fondo
- ✅ Focus states visibles
- ✅ Estados interactivos claramente diferenciados

---

## Componentes que Usan la Paleta

**Layout:**
- Header (categorías activas, underlines)
- Footer

**Búsqueda:**
- SearchToolbar (botones, badges)
- FilterPanel (botones seleccionados)
- PriceRangeSlider (track, thumbs)
- AreaRangeSlider (track, thumbs)
- ActiveFiltersBar (pills)
- SearchStats

**Property Cards:**
- PropertyCardPremium (precio, badges, botones)
- PropertyCardHorizontal (variante horizontal)
- Admin PropertyCard (acciones)

**Detalles:**
- GaleriaPropiedad (controles)
- TarjetaVendedor (elementos destacados)

**Admin:**
- DashboardStats (métricas)
- MisPropiedades (CTAs)
- GaleriaAdmin (controles de imagen)

**Autenticación:**
- FormButton (botones primarios)
- FormInput (focus states)
- Links de navegación (login, registro, recuperación)

**Modales:**
- QuickViewModal
- CompareBar
- CompareModal
- MapView

---

## Tips de Uso

### Jerarquía de Colores

1. **Primary (terracota)** - Acciones principales, CTAs, precios
2. **Dark (navy)** - Textos principales, headers
3. **Neutral (beige)** - Fondos secundarios, dividers
4. **Light (off-white)** - Fondo principal de la app
5. **Secondary (azul pastel)** - Información adicional, badges informativos
6. **Tertiary (teal)** - Links secundarios, elementos de apoyo

### Buenas Prácticas

```jsx
// ✅ BIEN - Contraste adecuado
<button className="bg-primary-600 text-white">Comprar</button>

// ❌ MAL - Poco contraste
<button className="bg-primary-200 text-white">Comprar</button>

// ✅ BIEN - Jerarquía clara
<div className="bg-light">
  <div className="bg-white shadow">
    <h2 className="text-dark">Título</h2>
    <p className="text-gray-600">Descripción</p>
    <button className="bg-primary-600 text-white">CTA</button>
  </div>
</div>

// ✅ BIEN - Estados diferenciados
<button className="bg-primary-600 hover:bg-primary-700 active:bg-primary-800 disabled:bg-primary-300">
  Botón
</button>
```

---

**Estado:** Implementación completa y verificada ✅
