"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAllAsRead = exports.markAsRead = exports.getUnreadNotifications = exports.getNotifications = exports.sendRecordingReadyNotification = exports.sendMeetingInvitationNotification = exports.sendFriendRequestNotification = void 0;
const notification_service_1 = require("../services/notification.service");
// POST /api/notifications/friend-request
const sendFriendRequestNotification = async (req, res, next) => {
    try {
        const data = req.body;
        await (0, notification_service_1.createFriendRequestNotification)(data);
        res.status(200).json({
            status: 'success',
            message: 'Friend request notification sent',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.sendFriendRequestNotification = sendFriendRequestNotification;
// POST /api/notifications/meeting-invitation
const sendMeetingInvitationNotification = async (req, res, next) => {
    try {
        const data = req.body;
        await (0, notification_service_1.createMeetingInvitationNotification)(data);
        res.status(200).json({
            status: 'success',
            message: 'Meeting invitation notification sent',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.sendMeetingInvitationNotification = sendMeetingInvitationNotification;
// POST /api/notifications/recording-ready
const sendRecordingReadyNotification = async (req, res, next) => {
    try {
        const data = req.body;
        await (0, notification_service_1.createRecordingReadyNotification)(data);
        res.status(200).json({
            status: 'success',
            message: 'Recording ready notification sent',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.sendRecordingReadyNotification = sendRecordingReadyNotification;
// GET /api/notifications/:userId
const getNotifications = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const notifications = await (0, notification_service_1.getUserNotifications)(userId);
        res.status(200).json({
            status: 'success',
            data: notifications,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getNotifications = getNotifications;
// GET /api/notifications/:userId/unread
const getUnreadNotifications = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const notifications = await (0, notification_service_1.getUserNotifications)(userId, true);
        res.status(200).json({
            status: 'success',
            data: notifications,
            count: notifications.length,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getUnreadNotifications = getUnreadNotifications;
// PATCH /api/notifications/:id/read
const markAsRead = async (req, res, next) => {
    try {
        const { id } = req.params;
        const notification = await (0, notification_service_1.markNotificationAsRead)(id);
        res.status(200).json({
            status: 'success',
            data: notification,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.markAsRead = markAsRead;
// PATCH /api/notifications/:userId/read-all
const markAllAsRead = async (req, res, next) => {
    try {
        const { userId } = req.params;
        await (0, notification_service_1.markAllNotificationsAsRead)(userId);
        res.status(200).json({
            status: 'success',
            message: 'All notifications marked as read',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.markAllAsRead = markAllAsRead;
//# sourceMappingURL=notification.controller.js.map