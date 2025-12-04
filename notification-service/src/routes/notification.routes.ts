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

// Create notifications (no auth required - internal service calls)
router.post(
    '/friend-request',
    validateRequest(friendRequestSchema),
    sendFriendRequestNotification
);

router.post(
    '/meeting-invitation',
    validateRequest(meetingInvitationSchema),
    sendMeetingInvitationNotification
);

router.post(
    '/recording-ready',
    validateRequest(recordingReadySchema),
    sendRecordingReadyNotification
);

// Get notifications
router.get('/:userId', getNotifications);
router.get('/:userId/unread', getUnreadNotifications);

// Update notifications
router.patch('/:id/read', markAsRead);
router.patch('/:userId/read-all', markAllAsRead);

export default router;
