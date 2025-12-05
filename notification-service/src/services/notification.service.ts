/*
 * This file contains the notification service business logic.
 * It handles creation of different types of notifications, manages
 * Socket.io real-time events, sends emails, and provides functions
 * for retrieving and updating notification status.
 */

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

// Socket.io server instance for real-time notifications
let io: SocketServer | null = null;

/**
 * Sets the Socket.io server instance to be used for real-time notifications.
 * This function must be called during server initialization before sending notifications.
 * 
 * @param socketServer - The Socket.io server instance
 */
export function setSocketServer(socketServer: SocketServer): void {
    io = socketServer;
}

/**
 * Emits a real-time notification to a specific user via Socket.io.
 * The notification is sent to the user's room identified by their user ID.
 * 
 * @param userId - The ID of the user to receive the notification
 * @param payload - The notification data to send
 */
function emitNotification(userId: string, payload: SocketNotificationPayload): void {
    if (io) {
        io.to(userId).emit('new_notification', payload);
        logger.debug(`Socket notification emitted to user ${userId}`);
    }
}

/**
 * Creates and sends a friend request notification.
 * This function creates a notification in the database, sends an email,
 * and emits a real-time Socket.io event to the receiver.
 * 
 * @param data - Friend request notification data including sender and receiver information
 * @throws {Error} If notification creation or email sending fails
 */
export async function createFriendRequestNotification(
    data: CreateFriendRequestNotificationDTO
): Promise<void> {
    try {
        // Create notification document in MongoDB
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

        // Send email notification
        const emailSent = await sendFriendRequestEmail(data);
        if (emailSent) {
            notification.emailSent = true;
            await notification.save();
        }

        // Emit real-time notification via Socket.io
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

/**
 * Creates and sends a meeting invitation notification.
 * This function creates a notification in the database, sends an email,
 * and emits a real-time Socket.io event to the invited user.
 * 
 * @param data - Meeting invitation data including host, meeting details, and invitee information
 * @throws {Error} If notification creation or email sending fails
 */
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

        // Send email notification
        const emailSent = await sendMeetingInvitationEmail(data);
        if (emailSent) {
            notification.emailSent = true;
            await notification.save();
        }

        // Emit real-time notification via Socket.io
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

/**
 * Creates and sends a recording ready notification.
 * This function creates a notification in the database, sends an email,
 * and emits a real-time Socket.io event to the user.
 * 
 * @param data - Recording notification data including meeting title, duration, and recording URL
 * @throws {Error} If notification creation or email sending fails
 */
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

        // Send email notification
        const emailSent = await sendRecordingReadyEmail(data);
        if (emailSent) {
            notification.emailSent = true;
            await notification.save();
        }

        // Emit real-time notification via Socket.io
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

/**
 * Retrieves notifications for a specific user from the database.
 * Results are sorted by creation date (newest first) and limited to 50 items.
 * 
 * @param userId - The ID of the user whose notifications to retrieve
 * @param unreadOnly - If true, only returns unread notifications
 * @returns Array of notification documents
 * @throws {Error} If database query fails
 */
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

/**
 * Marks a specific notification as read in the database.
 * 
 * @param notificationId - The ID of the notification to mark as read
 * @returns The updated notification document
 * @throws {Error} If notification is not found or update fails
 */
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

/**
 * Marks all unread notifications for a user as read.
 * This is useful for "mark all as read" functionality.
 * 
 * @param userId - The ID of the user whose notifications to mark as read
 * @throws {Error} If database update fails
 */
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

/**
 * Fetches user information from Clerk authentication service.
 * This is used to retrieve user details like email and name for notifications.
 * 
 * @param userId - The Clerk user ID
 * @returns User object containing id, email, name, and image URL
 * @throws {Error} If Clerk API call fails
 */
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
