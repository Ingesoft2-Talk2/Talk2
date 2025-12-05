"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordingReadySchema = exports.meetingInvitationSchema = exports.friendRequestSchema = void 0;
const zod_1 = require("zod");
exports.friendRequestSchema = zod_1.z.object({
    receiverId: zod_1.z.string().min(1, 'receiverId is required'),
    receiverEmail: zod_1.z.string().email('Invalid email'),
    senderName: zod_1.z.string().min(1, 'senderName is required'),
    senderImageUrl: zod_1.z.string().optional(),
    friendRequestId: zod_1.z.string().min(1, 'friendRequestId is required'),
});
exports.meetingInvitationSchema = zod_1.z.object({
    invitedUserId: zod_1.z.string().min(1, 'invitedUserId is required'),
    invitedUserEmail: zod_1.z.string().email('Invalid email'),
    meetingId: zod_1.z.string().min(1, 'meetingId is required'),
    meetingTitle: zod_1.z.string().min(1, 'meetingTitle is required'),
    meetingUrl: zod_1.z.string().url('Invalid meeting URL'),
    hostName: zod_1.z.string().min(1, 'hostName is required'),
    scheduledTime: zod_1.z.string().datetime().optional(),
});
exports.recordingReadySchema = zod_1.z.object({
    userId: zod_1.z.string().min(1, 'userId is required'),
    userEmail: zod_1.z.string().email('Invalid email'),
    recordingId: zod_1.z.string().min(1, 'recordingId is required'),
    recordingUrl: zod_1.z.string().url('Invalid recording URL'),
    meetingTitle: zod_1.z.string().min(1, 'meetingTitle is required'),
    duration: zod_1.z.number().positive().optional(),
});
//# sourceMappingURL=notification.validators.js.map