# Notification Service - Deployment Guide

## Project Summary

**Microservicio de Notificaciones para Talk2**
- Envío profesional de emails con SendGrid
- Notificaciones en tiempo real con Socket.io
- Almacenamiento en MongoDB
- Desplegado en Railway (Producción)

---

## URLs de Producción

| Servicio | URL |
|----------|-----|
| **Notification Service** | `https://notification-service-production-c05d.up.railway.app` |
| **Main App (Vercel)** | `https://talk2-one.vercel.app` |
| **GitHub Repository** | `https://github.com/Ingesoft2-Talk2/Talk2` |
| **Branch** | `developer/jvergaran` |

---

## ✅ Estado Actual

- ✅ Código commiteado y pusheado a GitHub
- ✅ Desplegado en Railway (Producción)
- ✅ MongoDB configurado
- ✅ SendGrid integrado
- ✅ Docker funcionando localmente

---

## Configuración Requerida en Vercel

**ACCIÓN REQUERIDA:** El compañero que administra Vercel debe agregar esta variable:

### Variable de Entorno en Vercel

```
Name: NOTIFICATION_SERVICE_URL
Value: https://notification-service-production-c05d.up.railway.app
Environments: ✓ Production ✓ Preview ✓ Development
```

**Pasos:**
1. Ir a Vercel → Proyecto Talk2 → Settings → Environment Variables
2. Agregar la variable arriba
3. Hacer **Redeploy** del último deployment

---

## 🔑 Variables de Entorno (Railway)

Configuradas en Railway para el servicio de notificaciones:

```env
SENDGRID_API_KEY=SG.your_sendgrid_api_key_here
FROM_EMAIL=j.luis23vergara.novoa@gmail.com
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key_here
FRONTEND_URL=http://localhost:3000
PORT=4000
NODE_ENV=production
MONGO_URL=[Generada automáticamente por Railway]
```

> ** Nota:** `FRONTEND_URL` quedó en localhost. Cambiarla manualmente en Railway a `https://talk2-one.vercel.app` cuando sea posible.

---

## SendGrid Configuration

**Cuenta:** j.luis23vergara.novoa@gmail.com
**Sender Verificado:** ✅ j.luis23vergara.novoa@gmail.com
**Plan:** Free (100 emails/día)

### Acceso a SendGrid
- URL: https://app.sendgrid.com
- Login con: j.luis23vergara.novoa@gmail.com

---

## Docker (Desarrollo Local)

### Comandos Rápidos

```bash
# Iniciar servicios
cd Talk2/Final-Project
docker compose up -d

# Ver logs
docker compose logs -f notification-service

# Detener servicios
docker compose down

# Reconstruir
docker compose build notification-service
```

### Servicios en Docker
- `talk2_notification` (puerto 4000)
- `talk2_mongo` (puerto 27017)

---

## Testing

### Test Local
```bash
# 1. Iniciar servicios
docker compose up -d

# 2. Iniciar app principal
cd Talk2/Final-Project
npm run dev

# 3. Probar
# - Ir a http://localhost:3000
# - Enviar solicitud de amistad
# - Verificar email
```

### Test en Producción
1. Ir a https://talk2-one.vercel.app
2. Enviar solicitud de amistad
3. Verificar que llegue el email desde SendGrid

---

## Estructura del Proyecto

```
Talk2/
├── Final-Project/              # Main App (Next.js)
│   ├── src/app/api/friend-request/[id]/route.ts  # Integración con notifications
│   └── docker-compose.yml      # Orquestación de servicios
│
└── notification-service/       # Microservicio (TypeScript)
    ├── src/
    │   ├── config/
    │   │   └── email.ts        # SendGrid config
    │   ├── services/
    │   │   ├── email.service.ts
    │   │   └── notification.service.ts
    │   └── socket/
    │       └── socket.handler.ts
    ├── Dockerfile
    ├── .env.example
    └── package.json
```

---

## Workflow de Desarrollo

### Para hacer cambios al microservicio:

```bash
# 1. Hacer cambios en el código
cd Talk2/notification-service

# 2. Probar localmente
docker compose up -d

# 3. Correr linter
npm run lint:fix

# 4. Commit y push
git add .
git commit -m "descripción del cambio"
git push origin developer/jvergaran

# 5. Railway hace deploy automáticamente
```

---

## Troubleshooting

### Email no llega
- ✅ Verificar que SendGrid sender esté verificado
- ✅ Revisar logs en Railway: `View Logs` en el deployment
- ✅ Verificar que `SENDGRID_API_KEY` esté correcta

### Servicio no responde
- ✅ Verificar que Railway esté "Active" (verde)
- ✅ Revisar logs de Railway
- ✅ Verificar que `MONGO_URL` esté configurada

### Variables de entorno
- ✅ Verificar en Railway → Service → Variables
- ✅ Después de cambiar variables, Railway redeploya automáticamente

---


