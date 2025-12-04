import { Server as SocketServer } from 'socket.io';
import { CreateFriendRequestNotificationDTO, CreateMeetingInvitationNotificationDTO, CreateRecordingReadyNotificationDTO } from '../types/notification.types';
export declare function setSocketServer(socketServer: SocketServer): void;
export declare function createFriendRequestNotification(data: CreateFriendRequestNotificationDTO): Promise<void>;
export declare function createMeetingInvitationNotification(data: CreateMeetingInvitationNotificationDTO): Promise<void>;
export declare function createRecordingReadyNotification(data: CreateRecordingReadyNotificationDTO): Promise<void>;
export declare function getUserNotifications(userId: string, unreadOnly?: boolean): Promise<(import("mongoose").FlattenMaps<import("../types/notification.types").INotification> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
})[]>;
export declare function markNotificationAsRead(notificationId: string): Promise<import("mongoose").Document<unknown, {}, import("../types/notification.types").INotification, {}, {}> & import("../types/notification.types").INotification & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
export declare function markAllNotificationsAsRead(userId: string): Promise<void>;
export declare function getUserFromClerk(userId: string): Promise<{
    id: string;
    email: string;
    name: string;
    imageUrl: string;
}>;
//# sourceMappingURL=notification.service.d.ts.map