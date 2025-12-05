/*
 * This file defines the Mongoose schema and model for notifications.
 * It represents notifications stored in MongoDB with fields for user identification,
 * notification type, content, metadata, and read status.
 */

import mongoose, { Schema } from 'mongoose';
import { INotification, NotificationType } from '../types/notification.types';

/**
 * Mongoose schema for the Notification model.
 * This schema defines the structure of notification documents in MongoDB,
 * including validation rules, indexes, and default values.
 */
const NotificationSchema = new Schema<INotification>(
    {
        // User ID to whom this notification belongs
        userId: {
            type: String,
            required: true,
            index: true,
        },
        // Type of notification (friend_request, meeting_invitation, etc.)
        type: {
            type: String,
            enum: Object.values(NotificationType),
            required: true,
        },
        // Notification title displayed to the user
        title: {
            type: String,
            required: true,
        },
        // Detailed notification message
        message: {
            type: String,
            required: true,
        },
        // Additional data specific to the notification type
        metadata: {
            type: Schema.Types.Mixed,
            required: true,
        },
        // Flag indicating if an email was sent for this notification
        emailSent: {
            type: Boolean,
            default: false,
        },
        // Flag indicating if the user has read this notification
        isRead: {
            type: Boolean,
            default: false,
            index: true,
        },
    },
    {
        // Automatically add createdAt and updatedAt timestamps
        timestamps: true,
    }
);

// Composite indexes for frequently used queries
NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, isRead: 1 });

/**
 * Mongoose model for notifications.
 * This model provides an interface to interact with the notifications collection
 * in MongoDB, supporting CRUD operations and queries.
 */
export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
