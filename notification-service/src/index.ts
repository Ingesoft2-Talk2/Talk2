/*
 * This file is the main entry point for the notification microservice.
 * It initializes the Express server, configures middleware, sets up Socket.io
 * for real-time notifications, and connects to MongoDB for data persistence.
 */

import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { connectDatabase } from './config/database';
import { setupSocketServer } from './socket/socket.handler';
import { setSocketServer } from './services/notification.service';
import notificationRoutes from './routes/notification.routes';
import { errorHandler } from './middleware/error.middleware';
import { logger } from './utils/logger';

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Configure middleware for JSON parsing and CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
    })
);

// Health check endpoint for service monitoring
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', service: 'notification-service' });
});

// Register notification API routes
app.use('/api/notifications', notificationRoutes);

// Error handling middleware (must be registered last)
app.use(errorHandler);

/**
 * Initializes and starts the notification service server.
 * This function connects to MongoDB, sets up Socket.io for real-time
 * communication, and starts listening on the configured port.
 * 
 * @throws {Error} If database connection or server initialization fails
 */
async function startServer() {
    try {
        // Establish connection to MongoDB database
        await connectDatabase();

        // Initialize Socket.io server for real-time notifications
        const io = setupSocketServer(server);
        setSocketServer(io);

        // Start HTTP server on configured port
        const PORT = process.env.PORT || 4000;
        server.listen(PORT, () => {
            logger.info(`🚀 Notification Service running on port ${PORT}`);
            logger.info(`📧 Email notifications enabled`);
            logger.info(`🔌 Socket.io enabled for real-time notifications`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Handle unhandled promise rejections to prevent silent failures
process.on('unhandledRejection', (error) => {
    logger.error('Unhandled Promise Rejection:', error);
    process.exit(1);
});

// Start the notification service
startServer();
