# Configuración del Notification Service

## Variables de Entorno

### Opción 1: Copiar y Configurar (Recomendado)

```bash
# 1. Copiar el archivo de ejemplo
cp .env.example .env

# 2. Editar SOLO estas líneas en .env:
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicación

# 3. Obtener contraseña de aplicación de Gmail:
# https://myaccount.google.com/apppasswords
```

### Opción 2: Usar Credenciales Compartidas del Equipo

Si tu compañero ya configuró Clerk, puedes copiar el `CLERK_SECRET_KEY` del archivo `.env` de `Final-Project`.

**Las demás variables ya tienen valores por defecto que funcionan.**

---

## Valores por Defecto

Estas variables ya están configuradas y **NO necesitas cambiarlas** para desarrollo local:

- `MONGO_URL=mongodb://localhost:27017/talk2-notifications` (Docker)
- `FRONTEND_URL=http://localhost:3000`
- `PORT=4000`
- `NODE_ENV=development`

---

## Para Producción (Railway)

Cuando desplieguen a Railway, las variables cambiarán automáticamente:

- `MONGO_URL` → Railway te da una URL de MongoDB
- `FRONTEND_URL` → URL de Vercel (ej: `https://talk2.vercel.app`)
- `EMAIL_USER` y `EMAIL_PASS` → Los mismos que uses localmente
