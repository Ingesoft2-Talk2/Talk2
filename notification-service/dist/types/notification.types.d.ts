import { Document } from 'mongoose';
export declare enum NotificationType {
    FRIEND_REQUEST = "FRIEND_REQUEST",
    MEETING_INVITATION = "MEETING_INVITATION",
    RECORDING_READY = "RECORDING_READY"
}
export interface FriendRequestMetadata {
    friendRequestId: string;
    senderName: string;
    senderImageUrl?: string;
}
export interface MeetingInvitationMetadata {
    meetingId: string;
    meetingTitle: string;
    meetingUrl: string;
    hostName: string;
    scheduledTime?: Date;
}
export interface RecordingReadyMetadata {
    recordingId: string;
    recordingUrl: string;
    meetingTitle: string;
    duration?: number;
}
export type NotificationMetadata = FriendRequestMetadata | MeetingInvitationMetadata | RecordingReadyMetadata;
export interface INotification extends Document {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    metadata: NotificationMetadata;
    emailSent: boolean;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateFriendRequestNotificationDTO {
    receiverId: string;
    receiverEmail: string;
    senderName: string;
    senderImageUrl?: string;
    friendRequestId: string;
}
export interface CreateMeetingInvitationNotificationDTO {
    invitedUserId: string;
    invitedUserEmail: string;
    meetingId: string;
    meetingTitle: string;
    meetingUrl: string;
    hostName: string;
    scheduledTime?: Date;
}
export interface CreateRecordingReadyNotificationDTO {
    userId: string;
    userEmail: string;
    recordingId: string;
    recordingUrl: string;
    meetingTitle: string;
    duration?: number;
}
export interface SocketNotificationPayload {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    metadata: NotificationMetadata;
    createdAt: Date;
}
//# sourceMappingURL=notification.types.d.ts.map