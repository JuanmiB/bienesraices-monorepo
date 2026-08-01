# TODO — Backlog de tareas pendientes

Registro del backlog acumulado durante el saneamiento y el sprint de organización de auth. Agrupado por categoría, con prioridad (alta/media/baja).

## 🔒 Seguridad

- [ ] **(alta) Hashear el `recoveryToken` antes de guardarlo en la DB.**
  Hoy se guarda y compara en texto plano (ver TODO en el comentario de `resetPassword` en `authController.js`). Si la DB se filtra, los tokens de reset activos son explotables. Hay que hashear al guardar (`recoverPassword`) y comparar hashes al validar (`User.findByValidRecoveryToken`).

- [ ] **(media) Unificar el formato de respuestas de error del backend.**
  Conviven dos shapes: `{ message }` (controllers) y `{ success, message, errors }` (middleware de validación). El frontend asume el primero y se rompe con el segundo (descubierto al tocar el login).

## 🧹 Organización / Mantenibilidad

- [ ] **(baja) Generalizar la validación de token del modelo para cubrir `verificationToken`.**
  `verifyEmail` duplica la misma validación (buscar por token + existencia + expiración) que ya extrajimos para `recoveryToken`, pero sobre `verificationToken`. Generalizar el método del modelo para cubrir ambos campos.

- [ ] **(baja) Extraer `cookieOptions` a un helper `getCookieOptions()`.**
  Está duplicado idéntico entre `authentication` (login) y `cerrarSesion` (logout).

- [ ] **(baja) Separar `authController.js` por capas.**
  Hace demasiado (9 funciones: login, verifyAuth, logout, recover, reset, verifyToken, registro, verifyEmail). Candidato a separar cuando avance con DDD/arquitectura hexagonal.

## 🗄️ Infraestructura / DB

- [ ] **(alta) Migrar la base de datos a Aiven.**
  Render dio de baja la base del free tier. Evaluar de paso alinear la paridad dev/prod usando PostgreSQL en ambos entornos (hoy MySQL en dev, Postgres en prod).

- [ ] **(media) Evaluar migrar de `db.sync()` a migraciones formales (Sequelize migrations) para producción.**
  `db.sync()` puede corromper datos ante cambios de modelo.

## 📄 Documentación / Limpieza

- [ ] **(media) Reconciliar `CLAUDE.md` con la realidad.**
  Quitar las advertencias de "Vite locked at 5.3.5, do not upgrade" (ya se despineó a Vite 6), corregir "3 paquetes compartidos" (son 5), aclarar Vercel vs Netlify.

- [ ] **(media) Actualizar/borrar `DOCUMENTACION_COMPLETA.md`.**
  Menciona `helpers/recoveryPasswordToken.js` y `helpers/email.js` que ya fueron borrados. Decidir si se actualiza o se elimina `PNPM_MIGRATION.md` (quedó desactualizado tras completar la migración).

- [ ] **(baja) Fase A de poda: borrar packages muertos confirmados por auditoría.**
  `shared-types` (0 imports reales), `eslint-config` (0 referencias), y `shared-utils/formatters.js` (0 usos). `shared-utils/constants` + `validation` SÍ se usan, mantener.

- [ ] **(baja) Integrar `apps/mobile` al workspace de pnpm.**
  Hoy está trackeado en git pero fuera del workspace, con deps en `"*"` en vez de `workspace:*`. Ojo: Metro pelea con la estructura de `node_modules` de pnpm — es la tarea más delicada, dejar para el final.

## 🛠️ Tooling (menor)

- [ ] **(baja) Configurar Prettier/EditorConfig o desactivar format-on-save.**
  Para evitar cambios fantasma de whitespace al abrir archivos.
