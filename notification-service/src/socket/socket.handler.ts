/*
 * This file configures and initializes the Socket.io server for real-time notifications.
 * It handles WebSocket connections, authentication via Clerk tokens, and manages
 * user rooms for targeted notification delivery.
 */

import { Server as SocketServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { clerkClient } from '../config/clerk';
import { logger } from '../utils/logger';

/**
 * Sets up and configures the Socket.io server for real-time communication.
 * This function creates a Socket.io instance, configures CORS, implements
 * authentication middleware, and handles connection/disconnection events.
 * 
 * @param httpServer - The HTTP server instance to attach Socket.io to
 * @returns Configured Socket.io server instance
 */
export function setupSocketServer(httpServer: HttpServer): SocketServer {
    const io = new SocketServer(httpServer, {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    /**
     * Socket.io authentication middleware.
     * Verifies Clerk JWT tokens before allowing WebSocket connections.
     * Authenticated users are assigned their userId for room management.
     */
    io.use(async (socket: Socket, next) => {
        try {
            const token = socket.handshake.auth.token;

            if (!token) {
                logger.warn('Socket connection attempt without token');
                return next(new Error('Authentication error: No token provided'));
            }

            // Verify JWT token with Clerk authentication service
            try {
                const sessionClaims = await clerkClient.verifyToken(token);
                (socket as any).userId = sessionClaims.sub;
                next();
            } catch (error) {
                logger.error('Socket token verification failed:', error);
                return next(new Error('Authentication error: Invalid token'));
            }
        } catch (error) {
            logger.error('Socket authentication error:', error);
            return next(new Error('Authentication error'));
        }
    });

    // Handle new WebSocket connections
    io.on('connection', (socket: Socket) => {
        const userId = (socket as any).userId;

        if (userId) {
            // Join user to their personal room for targeted notifications
            socket.join(userId);
            logger.info(`✅ User ${userId} connected via Socket.io`);

            // Handle client disconnection
            socket.on('disconnect', () => {
                logger.info(`User ${userId} disconnected from Socket.io`);
            });
        }
    });

    logger.info('Socket.io server configured');
    return io;
}
