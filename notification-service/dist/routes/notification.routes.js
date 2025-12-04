"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_controller_1 = require("../controllers/notification.controller");
const validation_middleware_1 = require("../middleware/validation.middleware");
const notification_validators_1 = require("../validators/notification.validators");
const router = (0, express_1.Router)();
// Create notifications (no auth required - internal service calls)
router.post('/friend-request', (0, validation_middleware_1.validateRequest)(notification_validators_1.friendRequestSchema), notification_controller_1.sendFriendRequestNotification);
router.post('/meeting-invitation', (0, validation_middleware_1.validateRequest)(notification_validators_1.meetingInvitationSchema), notification_controller_1.sendMeetingInvitationNotification);
router.post('/recording-ready', (0, validation_middleware_1.validateRequest)(notification_validators_1.recordingReadySchema), notification_controller_1.sendRecordingReadyNotification);
// Get notifications
router.get('/:userId', notification_controller_1.getNotifications);
router.get('/:userId/unread', notification_controller_1.getUnreadNotifications);
// Update notifications
router.patch('/:id/read', notification_controller_1.markAsRead);
router.patch('/:userId/read-all', notification_controller_1.markAllAsRead);
exports.default = router;
//# sourceMappingURL=notification.routes.js.map