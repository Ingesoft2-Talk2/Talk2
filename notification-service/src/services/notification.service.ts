import { Server as SocketServer } from 'socket.io';
import { Notification } from '../models/Notification';
import { clerkClient } from '../config/clerk';
import { logger } from '../utils/logger';
import {
    CreateFriendRequestNotificationDTO,
    CreateMeetingInvitationNotificationDTO,
    CreateRecordingReadyNotificationDTO,
    NotificationType,
    SocketNotificationPayload,
} from '../types/notification.types';
import {
    sendFriendRequestEmail,
    sendMeetingInvitationEmail,
    sendRecordingReadyEmail,
} from './email.service';

let io: SocketServer | null = null;

export function setSocketServer(socketServer: SocketServer): void {
    io = socketServer;
}

// Helper function to emit socket event
function emitNotification(userId: string, payload: SocketNotificationPayload): void {
    if (io) {
        io.to(userId).emit('new_notification', payload);
        logger.debug(`Socket notification emitted to user ${userId}`);
    }
}

// Create Friend Request Notification
export async function createFriendRequestNotification(
    data: CreateFriendRequestNotificationDTO
): Promise<void> {
    try {
        // Create notification in database
        const notification = await Notification.create({
            userId: data.receiverId,
            type: NotificationType.FRIEND_REQUEST,
            title: 'Nueva solicitud de amistad',
            message: `${data.senderName} te ha enviado una solicitud de amistad`,
            metadata: {
                friendRequestId: data.friendRequestId,
                senderName: data.senderName,
                senderImageUrl: data.senderImageUrl,
            },
            emailSent: false,
            isRead: false,
        });

        logger.info(`Friend request notification created for user ${data.receiverId}`);

        // Send email
        const emailSent = await sendFriendRequestEmail(data);
        if (emailSent) {
            notification.emailSent = true;
            await notification.save();
        }

        // Emit socket event
        emitNotification(data.receiverId, {
            id: notification._id.toString(),
            type: notification.type,
            title: notification.title,
            message: notification.message,
            metadata: notification.metadata,
            createdAt: notification.createdAt,
        });
    } catch (error) {
        logger.error('Error creating friend request notification:', error);
        throw error;
    }
}

// Create Meeting Invitation Notification
export async function createMeetingInvitationNotification(
    data: CreateMeetingInvitationNotificationDTO
): Promise<void> {
    try {
        const notification = await Notification.create({
            userId: data.invitedUserId,
            type: NotificationType.MEETING_INVITATION,
            title: 'Invitación a reunión',
            message: `${data.hostName} te ha invitado a: ${data.meetingTitle}`,
            metadata: {
                meetingId: data.meetingId,
                meetingTitle: data.meetingTitle,
                meetingUrl: data.meetingUrl,
                hostName: data.hostName,
                scheduledTime: data.scheduledTime,
            },
            emailSent: false,
            isRead: false,
        });

        logger.info(`Meeting invitation notification created for user ${data.invitedUserId}`);

        // Send email
        const emailSent = await sendMeetingInvitationEmail(data);
        if (emailSent) {
            notification.emailSent = true;
            await notification.save();
        }

        // Emit socket event
        emitNotification(data.invitedUserId, {
            id: notification._id.toString(),
            type: notification.type,
            title: notification.title,
            message: notification.message,
            metadata: notification.metadata,
            createdAt: notification.createdAt,
        });
    } catch (error) {
        logger.error('Error creating meeting invitation notification:', error);
        throw error;
    }
}

// Create Recording Ready Notification
export async function createRecordingReadyNotification(
    data: CreateRecordingReadyNotificationDTO
): Promise<void> {
    try {
        const notification = await Notification.create({
            userId: data.userId,
            type: NotificationType.RECORDING_READY,
            title: 'Grabación disponible',
            message: `Tu grabación de "${data.meetingTitle}" está lista`,
            metadata: {
                recordingId: data.recordingId,
                recordingUrl: data.recordingUrl,
                meetingTitle: data.meetingTitle,
                duration: data.duration,
            },
            emailSent: false,
            isRead: false,
        });

        logger.info(`Recording ready notification created for user ${data.userId}`);

        // Send email
        const emailSent = await sendRecordingReadyEmail(data);
        if (emailSent) {
            notification.emailSent = true;
            await notification.save();
        }

        // Emit socket event
        emitNotification(data.userId, {
            id: notification._id.toString(),
            type: notification.type,
            title: notification.title,
            message: notification.message,
            metadata: notification.metadata,
            createdAt: notification.createdAt,
        });
    } catch (error) {
        logger.error('Error creating recording ready notification:', error);
        throw error;
    }
}

// Get user notifications
export async function getUserNotifications(userId: string, unreadOnly = false) {
    try {
        const filter: any = { userId };
        if (unreadOnly) {
            filter.isRead = false;
        }

        const notifications = await Notification.find(filter)
            .sort({ createdAt: -1 })
            .limit(50)
            .lean();

        return notifications;
    } catch (error) {
        logger.error('Error fetching user notifications:', error);
        throw error;
    }
}

// Mark notification as read
export async function markNotificationAsRead(notificationId: string) {
    try {
        const notification = await Notification.findByIdAndUpdate(
            notificationId,
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            throw new Error('Notification not found');
        }

        return notification;
    } catch (error) {
        logger.error('Error marking notification as read:', error);
        throw error;
    }
}

// Mark all notifications as read
export async function markAllNotificationsAsRead(userId: string) {
    try {
        await Notification.updateMany(
            { userId, isRead: false },
            { isRead: true }
        );

        logger.info(`All notifications marked as read for user ${userId}`);
    } catch (error) {
        logger.error('Error marking all notifications as read:', error);
        throw error;
    }
}

// Get user info from Clerk
export async function getUserFromClerk(userId: string) {
    try {
        const user = await clerkClient.users.getUser(userId);
        return {
            id: user.id,
            email: user.emailAddresses[0]?.emailAddress || '',
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Usuario',
            imageUrl: user.imageUrl,
        };
    } catch (error) {
        logger.error(`Error fetching user ${userId} from Clerk:`, error);
        throw error;
    }
}
