# Bienes Raíces - Aplicación Móvil

Aplicación móvil desarrollada con Expo Router para iOS y Android.

## 📱 Requisitos Previos

### Para iOS (Solo macOS)
- macOS con Xcode instalado
- iOS Simulator (incluido con Xcode)
- O un iPhone físico con la app Expo Go

### Para Android
- Android Studio con un emulador configurado
- O un dispositivo Android físico con la app Expo Go

### General
- Node.js 18+ instalado
- Expo Go app instalada en tu dispositivo físico (opcional)
  - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
  - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

## 🚀 Inicio Rápido

### 1. Instalar dependencias
Desde la raíz del proyecto:
```bash
npm install
```

### 2. Configurar variables de entorno
El archivo `.env` ya está configurado con:
```env
EXPO_PUBLIC_API_URL=http://localhost:1234
EXPO_PUBLIC_ENV=development
```

**Importante:** Si vas a probar en un dispositivo físico, cambia `localhost` por la IP de tu computadora en la red local (ej: `http://192.168.1.100:1234`)

### 3. Iniciar el backend
En otra terminal, asegúrate de que el backend esté corriendo:
```bash
# Desde la raíz del proyecto
npm run dev:backend
```

### 4. Iniciar la app móvil

**Opción A: Inicio limpio (recomendado)**
```bash
npm run start:clean
```

**Opción B: Inicio normal**
```bash
npm start
```

### 5. Ejecutar en dispositivo/emulador

Una vez que Expo esté corriendo, verás un menú con opciones:

#### Dispositivo Físico (más fácil)
1. Escanea el código QR con:
   - **iOS**: App de Cámara nativa
   - **Android**: App Expo Go
2. La app se abrirá automáticamente

#### Emulador/Simulador
- Presiona `i` para iOS Simulator (solo macOS)
- Presiona `a` para Android Emulator
- Presiona `w` para abrir en navegador web

## 🛠️ Comandos Disponibles

```bash
npm start              # Iniciar servidor de desarrollo
npm run start:clean    # Iniciar con limpieza de caché
npm run android        # Abrir en Android
npm run ios            # Abrir en iOS (solo macOS)
npm run web            # Abrir en navegador
npm run clean          # Limpiar caché
npm run reset          # Limpiar y reiniciar con caché limpio
```

## 🐛 Solución de Problemas

### Error: "Port 8081 is already in use"
```bash
# Ejecutar script de limpieza
npm run start:clean

# O manualmente:
lsof -ti:8081 | xargs kill -9
npm run reset
```

### Error: "Cannot connect to Metro bundler"
1. Verifica que el servidor esté corriendo (verás "Waiting on http://localhost:8081")
2. Asegúrate de estar en la misma red WiFi (si usas dispositivo físico)
3. Reinicia el servidor: presiona `r` en la terminal de Expo

### Error: "Network request failed" al llamar a la API
1. Verifica que el backend esté corriendo en el puerto 1234
2. Si usas dispositivo físico, cambia `localhost` por la IP de tu computadora en `.env`:
   ```bash
   # Encuentra tu IP
   ifconfig | grep "inet " | grep -v 127.0.0.1

   # Actualiza .env
   EXPO_PUBLIC_API_URL=http://192.168.1.X:1234
   ```
3. Reinicia Expo después de cambiar el `.env`

### La app se congela o no carga
```bash
# Limpiar todo y reinstalar
npm run clean
rm -rf node_modules
npm install
npm run start:clean
```

### Warning de Watchman
Si ves warnings sobre "Recrawled this watch", ejecuta:
```bash
watchman watch-del '/Users/tu-usuario/Desktop/proyecto-ia'
watchman watch-project '/Users/tu-usuario/Desktop/proyecto-ia'
```

## 📁 Estructura del Proyecto

```
apps/mobile/
├── app/                    # Expo Router (rutas basadas en archivos)
│   ├── (tabs)/            # Navegación con tabs
│   │   ├── index.tsx      # Pantalla de inicio
│   │   └── _layout.tsx    # Layout de tabs
│   └── _layout.tsx        # Layout raíz
├── components/            # Componentes reutilizables
├── src/
│   └── providers/         # Context providers
├── assets/               # Imágenes, fuentes, etc.
├── .env                  # Variables de entorno
├── app.json              # Configuración de Expo
├── package.json
└── tsconfig.json
```

## 🔗 Paquetes Compartidos

La app móvil usa paquetes compartidos del monorepo:
- `@bienesraices/shared-types` - Tipos TypeScript
- `@bienesraices/shared-utils` - Utilidades compartidas
- `@bienesraices/shared-api` - Cliente API
- `@bienesraices/shared-logic` - Lógica de negocio y stores Zustand

## 📚 Recursos

- [Documentación de Expo](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [React Native](https://reactnative.dev/)
- [NativeWind (Tailwind para RN)](https://www.nativewind.dev/)

## 🆘 ¿Necesitas Ayuda?

1. Revisa esta guía de solución de problemas
2. Consulta los logs en la terminal de Expo
3. Verifica que todas las dependencias estén instaladas: `npm install`
4. Asegúrate de que el backend esté corriendo
