# 📸 Guía para Tomar Screenshots

## Screenshots Necesarios

### 1. **home.png** - Página Principal
**Resolución:** 1920x1080 (desktop)
**Vista:** Full page screenshot

**Debe mostrar:**
- ✅ Navbar con categorías horizontales
- ✅ Hero section con buscador
- ✅ Propiedades destacadas (3-4 visible)
- ✅ Footer

**Tips:**
- Asegúrate de tener propiedades destacadas con buenas imágenes
- Usa el navegador en modo normal (no DevTools abierto)

---

### 2. **search.png** - Vista de Búsqueda
**Resolución:** 1920x1080 (desktop)
**Vista:** Scroll hasta mostrar toolbar + grid de propiedades

**Debe mostrar:**
- ✅ SearchToolbar con filtros desplegados
- ✅ Barra de estadísticas (X de Y propiedades)
- ✅ Pills de filtros activos
- ✅ Grid de PropertyCards (al menos 6 visibles)
- ✅ Toggle de vistas (Grid/List/Map)

**Tips:**
- Aplica algunos filtros para mostrar la funcionalidad
- Asegúrate de que se vean los sliders de precio/área

---

### 3. **details.png** - Detalles de Propiedad
**Resolución:** 1920x1080 (desktop)
**Vista:** Scroll que muestre galería + detalles principales

**Debe mostrar:**
- ✅ Galería de imágenes con thumbnails
- ✅ Información de la propiedad (precio, ubicación, características)
- ✅ Descripción
- ✅ Mapa (si lo tienes)
- ✅ Formulario de contacto
- ✅ Info del agente/owner

**Tips:**
- Selecciona una propiedad con buenas imágenes
- Scroll para capturar la parte más importante

---

### 4. **admin.png** - Panel de Administración
**Resolución:** 1920x1080 (desktop)
**Vista:** Vista de "Mis Propiedades"

**Debe mostrar:**
- ✅ Lista de propiedades del usuario
- ✅ Botón "Crear Nueva Propiedad"
- ✅ Cards con opciones de editar/eliminar
- ✅ Estados de las propiedades (publicada, pendiente, etc.)

**Tips:**
- Crea al menos 3-4 propiedades de ejemplo
- Asegúrate de mostrar diferentes estados

---

### 5. **mobile.png** - Vista Mobile
**Resolución:** 375x812 (iPhone X) o 390x844 (iPhone 14)
**Vista:** Composición de 2-3 pantallas side by side

**Debe mostrar (en composición):**
- Panel 1: Home mobile con hamburger menu
- Panel 2: Búsqueda mobile
- Panel 3: Detalles mobile

**Tips:**
- Usa DevTools > Device Toolbar
- Puedes usar Figma o Photoshop para unir las capturas
- O usa una herramienta online como "MockUPhone"

---

## 🛠️ Herramientas Recomendadas

### Para Screenshots de Página Completa
- **Chrome Extension:** [Awesome Screenshot](https://chrome.google.com/webstore/detail/awesome-screenshot/nlipoenfbbikpbjkfpfillcgkibla)
- **Firefox Extension:** [Fireshot](https://addons.mozilla.org/en-US/firefox/addon/fireshot/)
- **Mac:** Cmd + Shift + 4 (area) o Cmd + Shift + 3 (pantalla completa)
- **Windows:** Windows + Shift + S

### Para Editarlas
- **Online:** [Photopea](https://www.photopea.com/) (gratis, como Photoshop)
- **Mac:** Preview (para recortar/anotar)
- **Windows:** Paint / Snipping Tool

### Para GIF Animado (Opcional pero MUY Recomendado)
- **Windows:** [ScreenToGif](https://www.screentogif.com/) (GRATIS y EXCELENTE)
- **Mac:** [Gifski](https://gif.ski/) o [LICEcap](https://www.cockos.com/licecap/)
- **Online:** [Gifcap](https://gifcap.dev/)

**Flow recomendado para GIF:**
1. Home → Click en categoría
2. Aplicar 2-3 filtros
3. Ver una propiedad
4. Abrir galería y navegar 2-3 fotos
5. Volver atrás
**Duración:** 10-15 segundos máximo
**FPS:** 15-20 (balance entre calidad y peso)
**Tamaño:** <5MB idealmente

---

## 📐 Dimensiones Ideales

```
Desktop: 1920x1080 o 1440x900
Mobile:  375x812 (iPhone X) o 390x844 (iPhone 14)
Tablet:  768x1024 (iPad)
GIF:     Max 1280px width, <5MB
```

---

## ✅ Checklist Antes de Tomar Screenshots

- [ ] Navegador en ventana limpia (sin extensiones visibles)
- [ ] Zoom al 100%
- [ ] Datos de prueba con buenas imágenes (no placeholders)
- [ ] Al menos 10-15 propiedades en la base de datos
- [ ] Usuario autenticado (para vistas de admin)
- [ ] Modo claro (si tienes dark mode, toma en claro primero)
- [ ] Sin errores en consola (F12)
- [ ] Datos realistas (nombres, precios, direcciones creíbles)

---

## 🎨 Tips para Screenshots Profesionales

### 1. Usa Imágenes Reales de Buena Calidad
No uses placeholders ni imágenes pixeladas. Fuentes:
- [Unsplash](https://unsplash.com/s/photos/real-estate)
- [Pexels](https://www.pexels.com/search/house/)
- [Pixabay](https://pixabay.com/images/search/house/)

### 2. Datos Realistas
```
❌ MAL:
Título: "Test Property 123"
Precio: $999999999
Ubicación: "AAAA BBBB"

✅ BIEN:
Título: "Casa moderna de 3 pisos en zona residencial"
Precio: $350,000
Ubicación: "Av. Principal 1234, Palermo, Buenos Aires"
```

### 3. Orden y Limpieza
- Sin errores de consola visibles
- Sin datos incompletos
- Sin "Lorem ipsum" (usa texto real)
- Sin URLs localhost visibles (si es posible)

### 4. Contraste y Colores
- Asegúrate de que el texto sea legible
- Los colores de marca (indigo) deben destacar
- No tomes screenshots con luz naranja de flux/night mode

---

## 📤 Subir Screenshots

Una vez tomadas:

1. **Optimiza el tamaño:**
   - Usa [TinyPNG](https://tinypng.com/) para reducir peso sin perder calidad
   - Target: <500KB por imagen

2. **Nombres correctos:**
   ```
   home.png
   search.png
   details.png
   admin.png
   mobile.png
   demo.gif (opcional)
   ```

3. **Colócalas en esta carpeta:**
   ```
   02-bienesraices-react/screenshots/
   ```

4. **Actualiza el README.md:**
   - Si usas rutas relativas, las imágenes se mostrarán automáticamente
   - Si usas GitHub, las imágenes se verán cuando hagas push

---

## 🚀 Siguiente Paso

Una vez tengas las screenshots:
1. ✅ Revisa que se vean bien en el README.md
2. ✅ Commit y push a GitHub
3. ✅ Verifica en GitHub que las imágenes se muestran correctamente
4. ✅ Comparte el link en LinkedIn/Twitter

**¡Tu README ahora se ve profesional!** 🎉
