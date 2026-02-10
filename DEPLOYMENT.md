# 🚀 Guía de Deployment

Esta guía te ayudará a desplegar la aplicación en producción.

## 📦 Servicios Utilizados

- **Frontend:** Vercel (gratis)
- **Backend + API:** Render (gratis)
- **Base de datos:** PostgreSQL en Render (gratis)

---

## 1️⃣ Deploy del Backend en Render

### Opción A: Deploy Automático con Blueprint (Recomendado)

1. **Ir a Render Dashboard**
   - Ve a https://dashboard.render.com/
   - Click en "New +" → "Blueprint"

2. **Conectar Repositorio**
   - Conecta tu cuenta de GitHub
   - Selecciona el repositorio `bienesraices-monorepo`
   - Render detectará automáticamente el archivo `render.yaml`

3. **Configurar Variables de Entorno**
   Render creará automáticamente:
   - ✅ `DATABASE_URL` (automático desde PostgreSQL)
   - ✅ `JWT_SECRET` (generado automáticamente)
   
   **Debes agregar manualmente:**
   - `FRONTEND_URL` → La URL de Vercel (la obtendrás después)
   - `CLOUDINARY_CLOUD_NAME` → Tu cloud name (opcional)
   - `CLOUDINARY_API_KEY` → Tu API key (opcional)
   - `CLOUDINARY_API_SECRET` → Tu API secret (opcional)
   - `EMAIL_HOST` → smtp.gmail.com (opcional)
   - `EMAIL_PORT` → 587 (opcional)
   - `EMAIL_USER` → Tu email (opcional)
   - `EMAIL_PASS` → Tu app password (opcional)

4. **Deploy**
   - Click en "Apply"
   - Espera 5-10 minutos mientras Render:
     - Crea la base de datos PostgreSQL
     - Instala dependencias
     - Inicia el servidor
   
5. **Obtener URL del Backend**
   - Una vez completado, verás una URL como:
   - `https://bienesraices-api.onrender.com`
   - **Guarda esta URL**, la necesitarás para Vercel

### Opción B: Deploy Manual

Si prefieres crear los servicios manualmente:

1. **Crear PostgreSQL Database**
   - New + → PostgreSQL
   - Name: `bienesraices-db`
   - Plan: Free
   - Click "Create Database"

2. **Crear Web Service**
   - New + → Web Service
   - Connect repository: `bienesraices-monorepo`
   - Name: `bienesraices-api`
   - Runtime: Node
   - Build Command: `npm install && npm run build -w @bienesraices/backend`
   - Start Command: `npm start -w @bienesraices/backend`
   - Plan: Free

3. **Agregar Variables de Entorno**
   - En el dashboard del Web Service
   - Environment → Add Environment Variable
   - Agregar todas las variables mencionadas arriba

---

## 2️⃣ Deploy del Frontend en Vercel

### Paso 1: Importar Proyecto

1. **Ir a Vercel Dashboard**
   - Ve a https://vercel.com/new
   - Click en "Import Project"

2. **Conectar Repositorio**
   - Conecta tu cuenta de GitHub si no lo has hecho
   - Busca y selecciona `bienesraices-monorepo`
   - Click en "Import"

### Paso 2: Configurar Proyecto

Vercel debería detectar automáticamente la configuración de `vercel.json`, pero verifica:

- **Framework Preset:** Vite
- **Root Directory:** `./` (raíz del monorepo)
- **Build Command:** `npm run build -w @bienesraices/frontend`
- **Output Directory:** `apps/frontend/dist`
- **Install Command:** `npm install`

### Paso 3: Variables de Entorno

Click en "Environment Variables" y agrega:

| Name | Value |
|------|-------|
| `VITE_API_URL` | Tu URL de Render (ej: `https://bienesraices-api.onrender.com`) |

### Paso 4: Deploy

1. Click en "Deploy"
2. Espera 2-3 minutos
3. Una vez completado, obtendrás una URL como:
   - `https://bienesraices-monorepo.vercel.app`

### Paso 5: Actualizar CORS en Backend

1. Ve a Render Dashboard
2. Abre tu Web Service `bienesraices-api`
3. Environment → Edita `FRONTEND_URL`
4. Cambia el valor a tu URL de Vercel
5. El servicio se redesplegará automáticamente

---

## 3️⃣ Configurar Base de Datos

Una vez que el backend esté en Render:

### Ejecutar Migraciones

**Opción A: Desde Render Shell**
1. Ve a tu Web Service en Render
2. Click en "Shell" (en el menú lateral)
3. Ejecuta:
   ```bash
   npm run migrate -w @bienesraices/backend
   npm run db:importar -w @bienesraices/backend
   ```

**Opción B: Desde tu computadora**
1. Obtén el `DATABASE_URL` desde Render (Environment variables)
2. Agrégalo temporalmente a tu `.env` local
3. Ejecuta las migraciones localmente

---

## 4️⃣ Verificar Deployment

### Backend
Visita: `https://tu-backend.onrender.com/api/health`
Deberías ver un JSON de respuesta

### Frontend  
Visita: `https://tu-frontend.vercel.app`
Deberías ver la aplicación funcionando

### Probar Integración
1. Intenta registrarte
2. Verifica que los datos se guarden en la BD
3. Prueba el login
4. Navega por la aplicación

---

## 🔧 Troubleshooting

### Frontend no conecta con Backend
- ✅ Verifica que `VITE_API_URL` esté configurada correctamente
- ✅ Asegúrate de NO incluir `/` al final de la URL
- ✅ Verifica que CORS esté configurado en el backend

### Backend da error 502
- ✅ Revisa los logs en Render Dashboard
- ✅ Verifica que `DATABASE_URL` esté configurada
- ✅ El plan gratuito de Render tiene "cold starts" (tarda ~30seg en despertar)

### Base de datos no tiene tablas
- ✅ Ejecuta las migraciones desde Render Shell
- ✅ Verifica que la conexión a PostgreSQL sea correcta

### Variables de entorno no funcionan
- ✅ En Vercel, las variables deben empezar con `VITE_`
- ✅ En Render, NO uses `VITE_` prefix
- ✅ Después de cambiar variables, Render redespliega automáticamente
- ✅ En Vercel, necesitas redesplegar manualmente

---

## 🎯 Próximos Pasos

Una vez desplegado:

1. **Actualiza README.md**
   - Agrega los links de demo
   - Actualiza badges si quieres

2. **Configura Custom Domain** (Opcional)
   - En Vercel: Settings → Domains
   - En Render: Settings → Custom Domain

3. **Monitoring**
   - Vercel te da analytics automáticamente
   - Render te da logs y métricas

4. **Optimizaciones**
   - Considera upgrade a plan pagado si tienes mucho tráfico
   - Configura CDN para imágenes (Cloudinary)
   - Agrega caching en el backend

---

## 💰 Costos

- **Vercel:** Gratis (100GB bandwidth/mes)
- **Render:** Gratis con limitaciones:
  - El servidor se "duerme" después de 15min de inactividad
  - Primera request tarda ~30 segundos en despertar
  - 750 horas gratis/mes
  - PostgreSQL: 256MB storage, 97 conexiones

Para evitar cold starts en Render (plan gratuito):
- Usa un servicio como UptimeRobot para hacer ping cada 10 minutos
- O considera upgrade a $7/mes para instancias siempre activas

---

¡Listo! Tu aplicación debería estar en producción 🎉
