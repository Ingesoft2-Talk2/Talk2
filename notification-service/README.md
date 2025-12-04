# Microservicio de Notificaciones - Talk2

Este documento explica cómo usar el microservicio de notificaciones integrado con Talk2.

## 🚀 Configuración

### Variables de Entorno

#### Notification Service (.env)
```env
# MongoDB
MONGO_URL=mongodb://localhost:27017/talk2-notifications

# Clerk
CLERK_SECRET_KEY=tu_clerk_secret_key

# Email (Gmail)
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_app_password_de_gmail

# Frontend
FRONTEND_URL=http://localhost:3000

# Server
PORT=4000
```

#### Talk2 Frontend (.env.local)
```env
NEXT_PUBLIC_NOTIFICATION_SERVICE_URL=http://localhost:4000
```

## 📦 Instalación y Ejecución

### 1. Microservicio
```bash
cd notification-service
npm install
npm run dev
```

### 2. Talk2 Frontend
```bash
cd Final-Project
npm install
npm run dev
```

## 📧 Tipos de Notificaciones

### 1. Solicitud de Amistad
✅ **Integrado automáticamente**

Se envía cuando un usuario envía una solicitud de amistad.

### 2. Invitación a Reunión
Para enviar notificaciones de invitación a reuniones, usa el cliente:

```typescript
import { sendMeetingInvitationNotification } from '@/lib/notification-client';

await sendMeetingInvitationNotification(
  invitedUserId,
  invitedUserEmail,
  meetingId,
  "Daily Standup",
  "http://localhost:3000/meeting/abc123",
  "Juan Pérez",
  new Date("2025-12-01T10:00:00")
);
```

### 3. Grabación Lista
Para notificar cuando una grabación está lista:

```typescript
import { sendRecordingReadyNotification } from '@/lib/notification-client';

await sendRecordingReadyNotification(
  userId,
  userEmail,
  recordingId,
  "http://localhost:3000/recordings/xyz789",
  "Team Meeting",
  3600 // duración en segundos
);
```

## 🔌 Notificaciones en Tiempo Real

El hook `useNotifications` se conecta automáticamente al microservicio vía Socket.io:

```tsx
import { useNotifications } from '@/hooks/useNotifications';

function MyComponent() {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  
  return (
    <div>
      <p>Tienes {unreadCount} notificaciones nuevas</p>
    </div>
  );
}
```

## 🎨 Componentes UI

### NotificationBell
Muestra un ícono de campana con badge de contador:

```tsx
import { NotificationBell } from '@/components/notifications/NotificationBell';

<NotificationBell />
```

### NotificationDropdown
Muestra la lista de notificaciones:

```tsx
import { NotificationDropdown } from '@/components/notifications/NotificationDropdown';

<NotificationDropdown />
```

## 🔗 API Endpoints

### Crear Notificaciones
- `POST /api/notifications/friend-request`
- `POST /api/notifications/meeting-invitation`
- `POST /api/notifications/recording-ready`

### Consultar Notificaciones
- `GET /api/notifications/:userId` - Todas las notificaciones
- `GET /api/notifications/:userId/unread` - Solo no leídas

### Actualizar Notificaciones
- `PATCH /api/notifications/:id/read` - Marcar como leída
- `PATCH /api/notifications/:userId/read-all` - Marcar todas como leídas

## 📝 Notas

- Las notificaciones se envían por **email** y se almacenan en **MongoDB**
- Socket.io permite notificaciones en **tiempo real**
- Si el envío de email falla, la notificación igual se registra
- Las notificaciones no críticas no bloquean las operaciones principales
