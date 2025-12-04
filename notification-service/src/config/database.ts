import mongoose from 'mongoose';
import { logger } from '../utils/logger';

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

    // Handle connection events
    mongoose.connection.on('disconnected', () => {
        logger.warn('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('error', (error) => {
        logger.error('MongoDB error:', error);
    });
};
