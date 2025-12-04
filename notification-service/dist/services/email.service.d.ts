import { CreateFriendRequestNotificationDTO, CreateMeetingInvitationNotificationDTO, CreateRecordingReadyNotificationDTO } from '../types/notification.types';
export declare function sendFriendRequestEmail(data: CreateFriendRequestNotificationDTO): Promise<boolean>;
export declare function sendMeetingInvitationEmail(data: CreateMeetingInvitationNotificationDTO): Promise<boolean>;
export declare function sendRecordingReadyEmail(data: CreateRecordingReadyNotificationDTO): Promise<boolean>;
//# sourceMappingURL=email.service.d.ts.map