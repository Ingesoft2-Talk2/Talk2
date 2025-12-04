import { sgMail, FROM_EMAIL } from '../config/email';
import { logger } from '../utils/logger';
import {
  CreateFriendRequestNotificationDTO,
  CreateMeetingInvitationNotificationDTO,
  CreateRecordingReadyNotificationDTO,
} from '../types/notification.types';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Base HTML template
const getEmailTemplate = (content: string): string => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 32px;
            font-weight: bold;
            color: #2563eb;
          }
          .content {
            margin-bottom: 30px;
          }
          h1 {
            color: #1f2937;
            font-size: 24px;
            margin-bottom: 16px;
          }
          p {
            color: #4b5563;
            margin-bottom: 12px;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #2563eb;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            margin: 16px 0;
          }
          .button:hover {
            background-color: #1d4ed8;
          }
          .footer {
            text-align: center;
            color: #9ca3af;
            font-size: 14px;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
          }
          .user-info {
            background-color: #f9fafb;
            padding: 16px;
            border-radius: 6px;
            margin: 16px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Talk2 📹</div>
          </div>
          ${content}
          <div class="footer">
            <p>Este es un correo automático de Talk2. Por favor no respondas a este mensaje.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

// Friend Request Email
export async function sendFriendRequestEmail(data: CreateFriendRequestNotificationDTO): Promise<boolean> {
  const content = `
    <div class="content">
      <h1>Nueva solicitud de amistad</h1>
      <div class="user-info">
        ${data.senderImageUrl ? `<img src="${data.senderImageUrl}" alt="${data.senderName}" style="width: 50px; height: 50px; border-radius: 50%; margin-bottom: 10px;">` : ''}
        <p style="margin: 0;"><strong>${data.senderName}</strong> te ha enviado una solicitud de amistad en Talk2.</p>
      </div>
      <p>Acepta la solicitud para poder realizar videollamadas y compartir reuniones.</p>
      <a href="${FRONTEND_URL}/friends" class="button">Ver solicitudes de amistad</a>
    </div>
  `;

  const msg = {
    to: data.receiverEmail,
    from: FROM_EMAIL,
    subject: `${data.senderName} te envió una solicitud de amistad`,
    html: getEmailTemplate(content),
  };

  try {
    await sgMail.send(msg);
    logger.info(`✅ Friend request email sent to ${data.receiverEmail}`);
    return true;
  } catch (error) {
    logger.error('❌ Error sending friend request email:', error);
    return false;
  }
}

// Meeting Invitation Email
export async function sendMeetingInvitationEmail(data: CreateMeetingInvitationNotificationDTO): Promise<boolean> {
  const scheduledTimeText = data.scheduledTime
    ? `<p><strong>Hora programada:</strong> ${new Date(data.scheduledTime).toLocaleString('es-ES', {
      dateStyle: 'full',
      timeStyle: 'short',
    })}</p>`
    : '';

  const content = `
    <div class="content">
      <h1>Invitación a reunión</h1>
      <div class="user-info">
        <p><strong>${data.hostName}</strong> te ha invitado a una reunión:</p>
        <p style="font-size: 18px; color: #2563eb; margin: 8px 0;"><strong>${data.meetingTitle}</strong></p>
        ${scheduledTimeText}
      </div>
      <p>Únete a la reunión haciendo clic en el botón de abajo:</p>
      <a href="${data.meetingUrl}" class="button">Unirse a la reunión</a>
    </div>
  `;

  const msg = {
    to: data.invitedUserEmail,
    from: FROM_EMAIL,
    subject: `Invitación a reunión: ${data.meetingTitle}`,
    html: getEmailTemplate(content),
  };

  try {
    await sgMail.send(msg);
    logger.info(`✅ Meeting invitation email sent to ${data.invitedUserEmail}`);
    return true;
  } catch (error) {
    logger.error('❌ Error sending meeting invitation email:', error);
    return false;
  }
}

// Recording Ready Email
export async function sendRecordingReadyEmail(data: CreateRecordingReadyNotificationDTO): Promise<boolean> {
  const durationText = data.duration
    ? `<p><strong>Duración:</strong> ${Math.floor(data.duration / 60)} minutos</p>`
    : '';

  const content = `
    <div class="content">
      <h1>Grabación disponible</h1>
      <div class="user-info">
        <p>La grabación de tu reunión está lista:</p>
        <p style="font-size: 18px; color: #2563eb; margin: 8px 0;"><strong>${data.meetingTitle}</strong></p>
        ${durationText}
      </div>
      <p>Puedes ver y descargar la grabación cuando quieras:</p>
      <a href="${data.recordingUrl}" class="button">Ver grabación</a>
    </div>
  `;

  const msg = {
    to: data.userEmail,
    from: FROM_EMAIL,
    subject: `Grabación lista: ${data.meetingTitle}`,
    html: getEmailTemplate(content),
  };

  try {
    await sgMail.send(msg);
    logger.info(`✅ Recording ready email sent to ${data.userEmail}`);
    return true;
  } catch (error) {
    logger.error('❌ Error sending recording ready email:', error);
    return false;
  }
}
