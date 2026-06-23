# 🚀 Guía de Inicio Rápido - App Móvil

## ✅ Verificación Pre-vuelo

Antes de empezar, verifica que tienes:

1. **Backend corriendo** - El backend debe estar activo en el puerto 1234
2. **Node.js instalado** - Versión 18 o superior
3. **Expo Go instalado en tu teléfono** (recomendado para empezar) O un emulador configurado

## 📱 Método 1: Dispositivo Físico (MÁS FÁCIL)

### Paso 1: Descargar Expo Go
- **iPhone**: [App Store](https://apps.apple.com/app/expo-go/id982107779)
- **Android**: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

### Paso 2: Configurar IP del Backend (IMPORTANTE)

Si vas a usar tu teléfono, necesitas cambiar `localhost` por la IP de tu computadora:

```bash
# 1. Encuentra tu IP local
ifconfig | grep "inet " | grep -v 127.0.0.1

# Verás algo como: inet 192.168.1.105 netmask...
# Tu IP es: 192.168.1.105
```

Edita el archivo `.env` en `apps/mobile/.env`:
```env
# Cambia esto:
EXPO_PUBLIC_API_URL=http://localhost:1234

# Por esto (usa TU IP):
EXPO_PUBLIC_API_URL=http://192.168.1.105:1234
```

### Paso 3: Iniciar la App

```bash
# Opción A: Con script de limpieza (recomendado la primera vez)
npm run start:clean

# Opción B: Inicio normal
npm start
```

### Paso 4: Escanear QR

1. Verás un **código QR** en la terminal
2. **iPhone**: Abre la app de Cámara y escanea el QR
3. **Android**: Abre Expo Go y usa el escáner integrado
4. ¡Listo! La app se cargará en tu teléfono

## 💻 Método 2: Emulador/Simulador

### iOS (Solo macOS)

```bash
# 1. Asegúrate de tener Xcode instalado
xcode-select --install

# 2. Inicia Expo
npm start

# 3. Presiona 'i' en la terminal cuando veas el menú
```

### Android

```bash
# 1. Asegúrate de tener Android Studio y un emulador configurado
# 2. Abre el emulador desde Android Studio
# 3. Inicia Expo
npm start

# 4. Presiona 'a' en la terminal cuando veas el menú
```

## 🔧 Comandos Útiles Durante el Desarrollo

Cuando Expo esté corriendo, puedes presionar:
- `r` - Recargar la app
- `m` - Abrir menú de desarrollo en el dispositivo
- `j` - Abrir debugger
- `i` - Abrir en iOS simulator
- `a` - Abrir en Android emulator
- `w` - Abrir en navegador web

## 🐛 Problemas Comunes

### "Port 8081 already in use"
```bash
npm run start:clean
```

### "Cannot connect to development server"
1. Verifica que tu teléfono y computadora estén en la **misma red WiFi**
2. Asegúrate de haber cambiado `localhost` por tu IP en `.env`
3. Reinicia Expo: presiona `r` en la terminal

### "Network request failed" al hacer login/buscar propiedades
1. Verifica que el backend esté corriendo: `npm run dev:backend` desde la raíz
2. Prueba la API manualmente: abre `http://TU-IP:1234/api/health` en el navegador del teléfono
3. Si no carga, revisa el firewall de tu computadora

### La app muestra pantalla blanca
```bash
# Presiona 'r' en la terminal de Expo para recargar
# O sacude el teléfono y presiona "Reload"
```

## 📋 Checklist de Inicio

- [ ] Backend corriendo en puerto 1234
- [ ] Dependencias instaladas (`npm install` en la raíz)
- [ ] Archivo `.env` configurado con la IP correcta (si usas dispositivo físico)
- [ ] Expo Go instalado en el teléfono (si usas dispositivo físico)
- [ ] Teléfono y computadora en la misma red WiFi (si usas dispositivo físico)
- [ ] Expo iniciado con `npm start`
- [ ] QR escaneado o emulador abierto

## 🎯 Flujo Completo de Inicio

```bash
# Terminal 1: Backend
cd /ruta/al/proyecto
npm run dev:backend

# Terminal 2: Mobile
cd /ruta/al/proyecto/apps/mobile
npm run start:clean

# Escanea el QR con tu teléfono
# ¡A desarrollar! 🎉
```

## 📚 Siguiente Paso

Una vez que la app esté corriendo, lee el [README.md](./README.md) completo para entender la estructura del proyecto y los comandos disponibles.
