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

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
    })
);

// Health check
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', service: 'notification-service' });
});

// Routes
app.use('/api/notifications', notificationRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Initialize server
async function startServer() {
    try {
        // Connect to MongoDB
        await connectDatabase();

        // Setup Socket.io
        const io = setupSocketServer(server);
        setSocketServer(io);

        // Start server
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

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
    logger.error('Unhandled Promise Rejection:', error);
    process.exit(1);
});

// Start the server
startServer();
