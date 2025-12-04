import { Server as SocketServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { clerkClient } from '../config/clerk';
import { logger } from '../utils/logger';

export function setupSocketServer(httpServer: HttpServer): SocketServer {
    const io = new SocketServer(httpServer, {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    // Socket.io authentication middleware
    io.use(async (socket: Socket, next) => {
        try {
            const token = socket.handshake.auth.token;

            if (!token) {
                logger.warn('Socket connection attempt without token');
                return next(new Error('Authentication error: No token provided'));
            }

            // Verify token with Clerk
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

    io.on('connection', (socket: Socket) => {
        const userId = (socket as any).userId;

        if (userId) {
            // Join user to their personal room
            socket.join(userId);
            logger.info(`✅ User ${userId} connected via Socket.io`);

            socket.on('disconnect', () => {
                logger.info(`User ${userId} disconnected from Socket.io`);
            });
        }
    });

    logger.info('Socket.io server configured');
    return io;
}
