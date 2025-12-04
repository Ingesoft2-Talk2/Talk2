"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSocketServer = setSocketServer;
exports.createFriendRequestNotification = createFriendRequestNotification;
exports.createMeetingInvitationNotification = createMeetingInvitationNotification;
exports.createRecordingReadyNotification = createRecordingReadyNotification;
exports.getUserNotifications = getUserNotifications;
exports.markNotificationAsRead = markNotificationAsRead;
exports.markAllNotificationsAsRead = markAllNotificationsAsRead;
exports.getUserFromClerk = getUserFromClerk;
const Notification_1 = require("../models/Notification");
const clerk_1 = require("../config/clerk");
const logger_1 = require("../utils/logger");
const notification_types_1 = require("../types/notification.types");
const email_service_1 = require("./email.service");
let io = null;
function setSocketServer(socketServer) {
    io = socketServer;
}
// Helper function to emit socket event
function emitNotification(userId, payload) {
    if (io) {
        io.to(userId).emit('new_notification', payload);
        logger_1.logger.debug(`Socket notification emitted to user ${userId}`);
    }
}
// Create Friend Request Notification
async function createFriendRequestNotification(data) {
    try {
        // Create notification in database
        const notification = await Notification_1.Notification.create({
            userId: data.receiverId,
            type: notification_types_1.NotificationType.FRIEND_REQUEST,
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
        logger_1.logger.info(`Friend request notification created for user ${data.receiverId}`);
        // Send email
        const emailSent = await (0, email_service_1.sendFriendRequestEmail)(data);
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
    }
    catch (error) {
        logger_1.logger.error('Error creating friend request notification:', error);
        throw error;
    }
}
// Create Meeting Invitation Notification
async function createMeetingInvitationNotification(data) {
    try {
        const notification = await Notification_1.Notification.create({
            userId: data.invitedUserId,
            type: notification_types_1.NotificationType.MEETING_INVITATION,
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
        logger_1.logger.info(`Meeting invitation notification created for user ${data.invitedUserId}`);
        // Send email
        const emailSent = await (0, email_service_1.sendMeetingInvitationEmail)(data);
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
    }
    catch (error) {
        logger_1.logger.error('Error creating meeting invitation notification:', error);
        throw error;
    }
}
// Create Recording Ready Notification
async function createRecordingReadyNotification(data) {
    try {
        const notification = await Notification_1.Notification.create({
            userId: data.userId,
            type: notification_types_1.NotificationType.RECORDING_READY,
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
        logger_1.logger.info(`Recording ready notification created for user ${data.userId}`);
        // Send email
        const emailSent = await (0, email_service_1.sendRecordingReadyEmail)(data);
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
    }
    catch (error) {
        logger_1.logger.error('Error creating recording ready notification:', error);
        throw error;
    }
}
// Get user notifications
async function getUserNotifications(userId, unreadOnly = false) {
    try {
        const filter = { userId };
        if (unreadOnly) {
            filter.isRead = false;
        }
        const notifications = await Notification_1.Notification.find(filter)
            .sort({ createdAt: -1 })
            .limit(50)
            .lean();
        return notifications;
    }
    catch (error) {
        logger_1.logger.error('Error fetching user notifications:', error);
        throw error;
    }
}
// Mark notification as read
async function markNotificationAsRead(notificationId) {
    try {
        const notification = await Notification_1.Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
        if (!notification) {
            throw new Error('Notification not found');
        }
        return notification;
    }
    catch (error) {
        logger_1.logger.error('Error marking notification as read:', error);
        throw error;
    }
}
// Mark all notifications as read
async function markAllNotificationsAsRead(userId) {
    try {
        await Notification_1.Notification.updateMany({ userId, isRead: false }, { isRead: true });
        logger_1.logger.info(`All notifications marked as read for user ${userId}`);
    }
    catch (error) {
        logger_1.logger.error('Error marking all notifications as read:', error);
        throw error;
    }
}
// Get user info from Clerk
async function getUserFromClerk(userId) {
    try {
        const user = await clerk_1.clerkClient.users.getUser(userId);
        return {
            id: user.id,
            email: user.emailAddresses[0]?.emailAddress || '',
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Usuario',
            imageUrl: user.imageUrl,
        };
    }
    catch (error) {
        logger_1.logger.error(`Error fetching user ${userId} from Clerk:`, error);
        throw error;
    }
}
//# sourceMappingURL=notification.service.js.map