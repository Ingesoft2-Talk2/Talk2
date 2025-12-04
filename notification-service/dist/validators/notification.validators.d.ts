import { z } from 'zod';
export declare const friendRequestSchema: z.ZodObject<{
    receiverId: z.ZodString;
    receiverEmail: z.ZodString;
    senderName: z.ZodString;
    senderImageUrl: z.ZodOptional<z.ZodString>;
    friendRequestId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    friendRequestId: string;
    senderName: string;
    receiverId: string;
    receiverEmail: string;
    senderImageUrl?: string | undefined;
}, {
    friendRequestId: string;
    senderName: string;
    receiverId: string;
    receiverEmail: string;
    senderImageUrl?: string | undefined;
}>;
export declare const meetingInvitationSchema: z.ZodObject<{
    invitedUserId: z.ZodString;
    invitedUserEmail: z.ZodString;
    meetingId: z.ZodString;
    meetingTitle: z.ZodString;
    meetingUrl: z.ZodString;
    hostName: z.ZodString;
    scheduledTime: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    meetingId: string;
    meetingTitle: string;
    meetingUrl: string;
    hostName: string;
    invitedUserId: string;
    invitedUserEmail: string;
    scheduledTime?: string | undefined;
}, {
    meetingId: string;
    meetingTitle: string;
    meetingUrl: string;
    hostName: string;
    invitedUserId: string;
    invitedUserEmail: string;
    scheduledTime?: string | undefined;
}>;
export declare const recordingReadySchema: z.ZodObject<{
    userId: z.ZodString;
    userEmail: z.ZodString;
    recordingId: z.ZodString;
    recordingUrl: z.ZodString;
    meetingTitle: z.ZodString;
    duration: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    userId: string;
    meetingTitle: string;
    recordingId: string;
    recordingUrl: string;
    userEmail: string;
    duration?: number | undefined;
}, {
    userId: string;
    meetingTitle: string;
    recordingId: string;
    recordingUrl: string;
    userEmail: string;
    duration?: number | undefined;
}>;
//# sourceMappingURL=notification.validators.d.ts.map