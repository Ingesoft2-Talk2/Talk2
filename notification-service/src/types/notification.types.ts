/*
 * This file defines TypeScript types and interfaces for the notification system.
 * It includes notification types, metadata structures, DTOs for creating notifications,
 * and interfaces for database models and Socket.io payloads.
 */

import { Document } from 'mongoose';

/**
 * Enumeration of supported notification types in the system.
 * Each type corresponds to a different kind of user notification.
 */
export enum NotificationType {
    FRIEND_REQUEST = 'FRIEND_REQUEST',
    MEETING_INVITATION = 'MEETING_INVITATION',
    RECORDING_READY = 'RECORDING_READY',
}

/**
 * Metadata structure for friend request notifications.
 * Contains information about the sender and the friend request.
 */
export interface FriendRequestMetadata {
    friendRequestId: string;
    senderName: string;
    senderImageUrl?: string;
}

/**
 * Metadata structure for meeting invitation notifications.
 * Contains meeting details and scheduling information.
 */
export interface MeetingInvitationMetadata {
    meetingId: string;
    meetingTitle: string;
    meetingUrl: string;
    hostName: string;
    scheduledTime?: Date;
}

/**
 * Metadata structure for recording ready notifications.
 * Contains recording details and playback information.
 */
export interface RecordingReadyMetadata {
    recordingId: string;
    recordingUrl: string;
    meetingTitle: string;
    duration?: number;
}

/**
 * Union type of all possible notification metadata structures.
 * Used to ensure type safety when handling different notification types.
 */
export type NotificationMetadata =
    | FriendRequestMetadata
    | MeetingInvitationMetadata
    | RecordingReadyMetadata;

/**
 * Interface for the Notification MongoDB document.
 * Extends Mongoose Document to include database-specific properties.
 */
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

/**
 * Data Transfer Object for creating friend request notifications.
 * Contains all required information to send a friend request notification.
 */
export interface CreateFriendRequestNotificationDTO {
    receiverId: string;
    receiverEmail: string;
    senderName: string;
    senderImageUrl?: string;
    friendRequestId: string;
}

/**
 * Data Transfer Object for creating meeting invitation notifications.
 * Contains all required information to send a meeting invitation.
 */
export interface CreateMeetingInvitationNotificationDTO {
    invitedUserId: string;
    invitedUserEmail: string;
    meetingId: string;
    meetingTitle: string;
    meetingUrl: string;
    hostName: string;
    scheduledTime?: Date;
}

/**
 * Data Transfer Object for creating recording ready notifications.
 * Contains all required information to notify about available recordings.
 */
export interface CreateRecordingReadyNotificationDTO {
    userId: string;
    userEmail: string;
    recordingId: string;
    recordingUrl: string;
    meetingTitle: string;
    duration?: number;
}

/**
 * Payload structure for Socket.io notification events.
 * This is the data format sent to clients via WebSocket connections.
 */
export interface SocketNotificationPayload {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    metadata: NotificationMetadata;
    createdAt: Date;
}
