# 📱 Solución para iOS - Escaneo de QR

## Problema: El QR no abre la app en iPhone

### ✅ Solución 1: Usar Expo Go (RECOMENDADO)

El problema más común es que en iOS 11+, la cámara nativa NO abre directamente Expo, necesitas usar la app Expo Go.

**Pasos:**

1. **Instala Expo Go desde el App Store:**
   - Abre App Store en tu iPhone
   - Busca "Expo Go"
   - Instala la app oficial de Expo

2. **Abre Expo Go** (no uses la cámara nativa)

3. **Dentro de Expo Go:**
   - Presiona el botón "Scan QR code"
   - Escanea el código QR que aparece en tu terminal

4. **La app debería cargar automáticamente**

### ✅ Solución 2: Usar URL Manual

Si el QR no funciona, puedes ingresar la URL manualmente:

1. **Abre Expo Go en tu iPhone**

2. **En la terminal de Expo, busca la línea que dice:**
   ```
   Metro waiting on exp://192.168.X.X:8081
   ```

3. **Copia esa URL** (o escríbela manualmente en Expo Go)

4. **En Expo Go:**
   - Ve a la pestaña "Projects"
   - Presiona "Enter URL manually"
   - Pega la URL `exp://TU-IP:8081`

### ✅ Solución 3: Conectar por WiFi con el Mismo Nombre

**Requisitos:**
- Tu iPhone y tu Mac deben estar en la **misma red WiFi**
- Ambos deben usar **el mismo nombre de red** (no una red de invitados)

**Verifica:**
```bash
# En tu Mac, encuentra tu IP:
ifconfig | grep "inet " | grep -v 127.0.0.1

# Deberías ver algo como:
# inet 192.168.1.105 netmask 0xffffff00 broadcast 192.168.1.255
```

**En tu iPhone:**
- Settings → WiFi
- Verifica que estés conectado a la misma red
- Toca la 'i' junto al nombre de la red
- Verifica que la IP sea del mismo rango (ej: 192.168.1.X)

### ✅ Solución 4: Usar Tunnel Mode

Si nada funciona, usa el modo tunnel (más lento pero funciona con cualquier red):

```bash
# Detén Expo si está corriendo (Ctrl+C)

# Inicia con tunnel
npx expo start --tunnel

# Escanea el nuevo QR que aparece
```

**Nota:** El tunnel es más lento pero funciona incluso si estás en redes diferentes.

## 🔍 Diagnóstico

### Verifica que Expo esté corriendo correctamente:

Cuando ejecutes `npm run dev:mobile:clean`, deberías ver:

```
✅ CORRECTO:
   ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
   █ ▄▄▄▄▄ █▀ █▄▀█ ▄▄▄▄▄ █
   █ █   █ █▄▀ ▄ █ █   █ █
   ...

   › Metro waiting on exp://192.168.X.X:8081
   › Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

❌ INCORRECTO:
   › Port 8081 already in use
   › Waiting on http://localhost:8081
   (Sin QR)
```

### Si no ves el QR:

```bash
# 1. Mata todos los procesos
lsof -ti:8081 | xargs kill -9

# 2. Limpia caché
cd apps/mobile
rm -rf .expo node_modules/.cache

# 3. Inicia de nuevo
npm start
```

## 📱 Checklist Rápido

- [ ] Expo Go instalado en iPhone
- [ ] Mac e iPhone en la misma WiFi
- [ ] Backend corriendo (`npm run dev:backend`)
- [ ] Expo muestra un código QR (no solo texto)
- [ ] Escaneando desde Expo Go (NO desde la cámara nativa)

## 🆘 Si Nada Funciona

Usa el **modo tunnel** que funciona siempre:

```bash
cd apps/mobile
npx expo start --tunnel
```

Esto creará un túnel público que funciona desde cualquier lugar. Es más lento pero 100% confiable.

## 💡 Tip Pro

Una vez que funcione la primera vez, Expo Go recordará tu proyecto y aparecerá en la pestaña "Recently opened". Solo necesitarás tocarlo para volver a abrirlo.
