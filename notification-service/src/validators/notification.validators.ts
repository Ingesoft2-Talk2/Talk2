/*
 * This file defines Zod validation schemas for notification requests.
 * These schemas are used by the validation middleware to ensure
 * incoming requests contain valid data before processing.
 */

import { z } from 'zod';

/**
 * Validation schema for friend request notification creation.
 * Ensures all required fields are present and properly formatted.
 */
export const friendRequestSchema = z.object({
    receiverId: z.string().min(1, 'receiverId is required'),
    receiverEmail: z.string().email('Invalid email'),
    senderName: z.string().min(1, 'senderName is required'),
    senderImageUrl: z.string().optional(),
    friendRequestId: z.string().min(1, 'friendRequestId is required'),
});

/**
 * Validation schema for meeting invitation notification creation.
 * Validates meeting details, URLs, and optional scheduling information.
 */
export const meetingInvitationSchema = z.object({
    invitedUserId: z.string().min(1, 'invitedUserId is required'),
    invitedUserEmail: z.string().email('Invalid email'),
    meetingId: z.string().min(1, 'meetingId is required'),
    meetingTitle: z.string().min(1, 'meetingTitle is required'),
    meetingUrl: z.string().url('Invalid meeting URL'),
    hostName: z.string().min(1, 'hostName is required'),
    scheduledTime: z.string().datetime().optional(),
});

/**
 * Validation schema for recording ready notification creation.
 * Validates recording details, URLs, and optional duration information.
 */
export const recordingReadySchema = z.object({
    userId: z.string().min(1, 'userId is required'),
    userEmail: z.string().email('Invalid email'),
    recordingId: z.string().min(1, 'recordingId is required'),
    recordingUrl: z.string().url('Invalid recording URL'),
    meetingTitle: z.string().min(1, 'meetingTitle is required'),
    duration: z.number().positive().optional(),
});
