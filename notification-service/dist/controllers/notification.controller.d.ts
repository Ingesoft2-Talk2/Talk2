import { Request, Response, NextFunction } from 'express';
export declare const sendFriendRequestNotification: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const sendMeetingInvitationNotification: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const sendRecordingReadyNotification: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getNotifications: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getUnreadNotifications: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const markAsRead: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const markAllAsRead: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=notification.controller.d.ts.map