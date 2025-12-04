import { Request, Response, NextFunction } from 'express';
import {
    createFriendRequestNotification,
    createMeetingInvitationNotification,
    createRecordingReadyNotification,
    getUserNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
} from '../services/notification.service';
import {
    CreateFriendRequestNotificationDTO,
    CreateMeetingInvitationNotificationDTO,
    CreateRecordingReadyNotificationDTO,
} from '../types/notification.types';


// POST /api/notifications/friend-request
export const sendFriendRequestNotification = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const data: CreateFriendRequestNotificationDTO = req.body;
        await createFriendRequestNotification(data);

        res.status(200).json({
            status: 'success',
            message: 'Friend request notification sent',
        });
    } catch (error) {
        next(error);
    }
};

// POST /api/notifications/meeting-invitation
export const sendMeetingInvitationNotification = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const data: CreateMeetingInvitationNotificationDTO = req.body;
        await createMeetingInvitationNotification(data);

        res.status(200).json({
            status: 'success',
            message: 'Meeting invitation notification sent',
        });
    } catch (error) {
        next(error);
    }
};

// POST /api/notifications/recording-ready
export const sendRecordingReadyNotification = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const data: CreateRecordingReadyNotificationDTO = req.body;
        await createRecordingReadyNotification(data);

        res.status(200).json({
            status: 'success',
            message: 'Recording ready notification sent',
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/notifications/:userId
export const getNotifications = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { userId } = req.params;
        const notifications = await getUserNotifications(userId);

        res.status(200).json({
            status: 'success',
            data: notifications,
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/notifications/:userId/unread
export const getUnreadNotifications = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { userId } = req.params;
        const notifications = await getUserNotifications(userId, true);

        res.status(200).json({
            status: 'success',
            data: notifications,
            count: notifications.length,
        });
    } catch (error) {
        next(error);
    }
};

// PATCH /api/notifications/:id/read
export const markAsRead = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const notification = await markNotificationAsRead(id);

        res.status(200).json({
            status: 'success',
            data: notification,
        });
    } catch (error) {
        next(error);
    }
};

// PATCH /api/notifications/:userId/read-all
export const markAllAsRead = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { userId } = req.params;
        await markAllNotificationsAsRead(userId);

        res.status(200).json({
            status: 'success',
            message: 'All notifications marked as read',
        });
    } catch (error) {
        next(error);
    }
};
