/*
 * This file configures the MongoDB database connection for the notification service.
 * It handles connection initialization, error handling, and connection lifecycle events.
 */

import mongoose from 'mongoose';
import { logger } from '../utils/logger';

/**
 * Establishes a connection to the MongoDB database.
 * This function reads the connection URL from environment variables,
 * connects to MongoDB, and sets up event listeners for connection lifecycle.
 * 
 * @throws {Error} If MONGO_URL environment variable is not defined
 * @throws {Error} If connection to MongoDB fails
 */
export const connectDatabase = async (): Promise<void> => {
    const mongoUrl = process.env.MONGO_URL;

    if (!mongoUrl) {
        logger.error('MONGO_URL is not defined in environment variables');
        process.exit(1);
    }

    try {
        await mongoose.connect(mongoUrl);
        logger.info('✅ MongoDB connected successfully');
    } catch (error) {
        logger.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }

    // Handle connection lifecycle events
    mongoose.connection.on('disconnected', () => {
        logger.warn('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('error', (error) => {
        logger.error('MongoDB error:', error);
    });
};
