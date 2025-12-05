/*
 * This file contains the HTTP request handlers (controllers) for notification endpoints.
 * Each controller function handles a specific API endpoint, validates requests,
 * calls the appropriate service functions, and returns HTTP responses.
 */

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


/**
 * Handles POST /api/notifications/friend-request endpoint.
 * Creates and sends a friend request notification to the receiver.
 * 
 * @param req - Express request object containing friend request data in body
 * @param res - Express response object
 * @param next - Express next function for error handling
 */
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

/**
 * Handles POST /api/notifications/meeting-invitation endpoint.
 * Creates and sends a meeting invitation notification to the invited user.
 * 
 * @param req - Express request object containing meeting invitation data in body
 * @param res - Express response object
 * @param next - Express next function for error handling
 */
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

/**
 * Handles POST /api/notifications/recording-ready endpoint.
 * Creates and sends a recording ready notification to the user.
 * 
 * @param req - Express request object containing recording data in body
 * @param res - Express response object
 * @param next - Express next function for error handling
 */
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

/**
 * Handles GET /api/notifications/:userId endpoint.
 * Retrieves all notifications for a specific user.
 * 
 * @param req - Express request object with userId in params
 * @param res - Express response object
 * @param next - Express next function for error handling
 */
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

/**
 * Handles GET /api/notifications/:userId/unread endpoint.
 * Retrieves only unread notifications for a specific user.
 * 
 * @param req - Express request object with userId in params
 * @param res - Express response object
 * @param next - Express next function for error handling
 */
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

/**
 * Handles PATCH /api/notifications/:id/read endpoint.
 * Marks a specific notification as read.
 * 
 * @param req - Express request object with notification id in params
 * @param res - Express response object
 * @param next - Express next function for error handling
 */
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

/**
 * Handles PATCH /api/notifications/:userId/read-all endpoint.
 * Marks all notifications for a user as read.
 * 
 * @param req - Express request object with userId in params
 * @param res - Express response object
 * @param next - Express next function for error handling
 */
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
