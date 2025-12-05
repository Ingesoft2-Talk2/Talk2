/*
 * This file defines the API routes for the notification service.
 * It maps HTTP endpoints to their corresponding controller functions
 * and applies validation middleware to ensure request data integrity.
 */

import { Router } from 'express';
import {
    sendFriendRequestNotification,
    sendMeetingInvitationNotification,
    sendRecordingReadyNotification,
    getNotifications,
    getUnreadNotifications,
    markAsRead,
    markAllAsRead,
} from '../controllers/notification.controller';
import { validateRequest } from '../middleware/validation.middleware';
import {
    friendRequestSchema,
    meetingInvitationSchema,
    recordingReadySchema,
} from '../validators/notification.validators';

const router = Router();

// POST /api/notifications/friend-request - Create friend request notification
router.post(
    '/friend-request',
    validateRequest(friendRequestSchema),
    sendFriendRequestNotification
);

// POST /api/notifications/meeting-invitation - Create meeting invitation notification
router.post(
    '/meeting-invitation',
    validateRequest(meetingInvitationSchema),
    sendMeetingInvitationNotification
);

// POST /api/notifications/recording-ready - Create recording ready notification
router.post(
    '/recording-ready',
    validateRequest(recordingReadySchema),
    sendRecordingReadyNotification
);

// GET /api/notifications/:userId - Get all notifications for a user
router.get('/:userId', getNotifications);

// GET /api/notifications/:userId/unread - Get unread notifications for a user
router.get('/:userId/unread', getUnreadNotifications);

// PATCH /api/notifications/:id/read - Mark specific notification as read
router.patch('/:id/read', markAsRead);

// PATCH /api/notifications/:userId/read-all - Mark all notifications as read for a user
router.patch('/:userId/read-all', markAllAsRead);

export default router;
