# 🎯 Siguientes Pasos - App de Bienes Raíces

## ✅ ¡Felicidades! La App Está Funcionando

Has logrado:
- ✅ Configurar el proyecto móvil con Expo
- ✅ Instalar todas las dependencias
- ✅ Ejecutar la app en el emulador de Android
- ✅ Configurar los paquetes compartidos (shared-api, shared-logic)

## 📱 Probar en tu iPhone

### 1. Verificar configuración
El archivo `.env` ya está configurado con tu IP local:
```env
EXPO_PUBLIC_API_URL=http://10.100.39.199:1234
```

### 2. Asegúrate de que el backend esté corriendo
```bash
# En una terminal (desde la raíz del proyecto):
npm run dev:backend

# Verifica que esté corriendo en: http://10.100.39.199:1234/api/health
```

### 3. Inicia la app móvil
```bash
# En otra terminal:
./iniciar-mobile-ios.sh

# O manualmente:
cd apps/mobile
npm start
```

### 4. Escanea el QR desde Expo Go
- Abre **Expo Go** en tu iPhone (NO la cámara nativa)
- Presiona **"Scan QR code"**
- Escanea el QR que aparece en la terminal
- ¡Listo! La app debería cargar

## 🏗️ Estructura Actual de la App

```
apps/mobile/app/
├── (tabs)/                 # Navegación con tabs
│   ├── index.tsx          # Tab One (Home) - AQUÍ empieza
│   ├── two.tsx            # Tab Two
│   └── _layout.tsx        # Configuración de tabs
├── modal.tsx              # Pantalla modal (ícono ℹ️)
└── _layout.tsx            # Layout raíz con providers
```

## 🎨 Personalizar la App - Plan Sugerido

### Fase 1: Pantallas Principales

**Tab 1: Explorar Propiedades** (`index.tsx`)
- [ ] Lista de propiedades destacadas
- [ ] Barra de búsqueda
- [ ] Filtros básicos (precio, tipo)
- [ ] Cards de propiedades con imagen

**Tab 2: Favoritos** (`two.tsx`)
- [ ] Renombrar a "Favoritos"
- [ ] Lista de propiedades guardadas
- [ ] Usar `favoritesStore` de shared-logic

**Tab 3: Perfil** (nuevo)
- [ ] Crear `profile.tsx`
- [ ] Login/Logout
- [ ] Mis publicaciones (si es vendedor)
- [ ] Configuración

### Fase 2: Navegación

**Pantallas adicionales:**
- [ ] Detalle de propiedad (con galería)
- [ ] Búsqueda avanzada
- [ ] Mapa de propiedades
- [ ] Chat/Contacto con vendedor
- [ ] Publicar nueva propiedad

### Fase 3: Integración con Backend

Los servicios ya están disponibles en `@bienesraices/shared-api`:

```typescript
import { propertyService, authService } from '@bienesraices/shared-api'

// Ejemplo: Obtener propiedades
const properties = await propertyService.getProperties()

// Ejemplo: Login
const user = await authService.login(email, password)
```

Los stores de Zustand ya están en `@bienesraices/shared-logic`:

```typescript
import { useAuthStore, useFavoritesStore } from '@bienesraices/shared-logic'

// En tu componente
const { user, login, logout } = useAuthStore()
const { favorites, addFavorite } = useFavoritesStore()
```

## 🚀 Empezar Ahora

### Opción 1: Modificar Tab One (más simple)

Edita `app/(tabs)/index.tsx` para mostrar una lista de propiedades:

```typescript
import { View, Text, FlatList } from 'react-native'
import { useEffect, useState } from 'react'
import { propertyService } from '@bienesraices/shared-api'

export default function HomeScreen() {
  const [properties, setProperties] = useState([])

  useEffect(() => {
    loadProperties()
  }, [])

  const loadProperties = async () => {
    try {
      const data = await propertyService.getProperties()
      setProperties(data)
    } catch (error) {
      console.error('Error loading properties:', error)
    }
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        Propiedades Disponibles
      </Text>
      <FlatList
        data={properties}
        renderItem={({ item }) => (
          <View style={{ padding: 16, borderBottomWidth: 1 }}>
            <Text style={{ fontSize: 18 }}>{item.titulo}</Text>
            <Text>{item.precio}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  )
}
```

### Opción 2: Usar NativeWind (Tailwind para React Native)

La app ya tiene NativeWind configurado. Puedes usar clases de Tailwind:

```typescript
import { View, Text } from 'react-native'

export default function Screen() {
  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-2xl font-bold text-gray-900">
        ¡Hola con Tailwind!
      </Text>
    </View>
  )
}
```

## 🧪 Desarrollo y Testing

### Hot Reload
Cuando edites archivos, la app se recargará automáticamente:
1. Guarda el archivo
2. La app se actualiza sola
3. Si no funciona, presiona `r` en la terminal de Expo

### Debug
- Sacude el dispositivo/emulador para abrir el menú de desarrollo
- Presiona `j` en la terminal para abrir el debugger
- `console.log()` aparece en la terminal de Expo

### Comandos útiles durante desarrollo
```bash
# Recargar la app
r

# Abrir menu de desarrollo
m

# Limpiar caché y recargar
shift + r

# Abrir debugger
j
```

## 📚 Recursos Útiles

- [Expo Router Docs](https://docs.expo.dev/router/introduction/)
- [React Native Docs](https://reactnative.dev/)
- [NativeWind Docs](https://www.nativewind.dev/)
- Código del frontend web en `apps/frontend/src/features/` (puedes reutilizar lógica)

## 🎯 Checklist de Inicio

- [x] App corriendo en emulador Android
- [ ] App corriendo en iPhone físico
- [ ] Backend conectado y respondiendo
- [ ] Primera llamada a la API funcionando
- [ ] Mostrar lista de propiedades
- [ ] Navegación entre pantallas
- [ ] Autenticación implementada

## 💡 Tips

1. **Reutiliza lógica del frontend web**: Revisa `apps/frontend/src/features/properties/` para ideas
2. **Los paquetes compartidos ya tienen todo**: No necesitas reescribir servicios API
3. **NativeWind es como Tailwind**: Si sabes Tailwind, ya sabes NativeWind
4. **Expo Router es similar a Next.js**: Rutas basadas en archivos

## 🆘 Ayuda

Si tienes dudas:
1. Revisa `apps/mobile/README.md` - Documentación completa
2. Revisa `apps/mobile/SOLUCION-IOS.md` - Problemas específicos de iOS
3. Revisa el código del frontend web para ejemplos

---

**¡Empieza modificando `app/(tabs)/index.tsx` y construye tu app de Bienes Raíces! 🏠📱**
