"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocketServer = setupSocketServer;
const socket_io_1 = require("socket.io");
const clerk_1 = require("../config/clerk");
const logger_1 = require("../utils/logger");
function setupSocketServer(httpServer) {
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });
    // Socket.io authentication middleware
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                logger_1.logger.warn('Socket connection attempt without token');
                return next(new Error('Authentication error: No token provided'));
            }
            // Verify token with Clerk
            try {
                const sessionClaims = await clerk_1.clerkClient.verifyToken(token);
                socket.userId = sessionClaims.sub;
                next();
            }
            catch (error) {
                logger_1.logger.error('Socket token verification failed:', error);
                return next(new Error('Authentication error: Invalid token'));
            }
        }
        catch (error) {
            logger_1.logger.error('Socket authentication error:', error);
            return next(new Error('Authentication error'));
        }
    });
    io.on('connection', (socket) => {
        const userId = socket.userId;
        if (userId) {
            // Join user to their personal room
            socket.join(userId);
            logger_1.logger.info(`✅ User ${userId} connected via Socket.io`);
            socket.on('disconnect', () => {
                logger_1.logger.info(`User ${userId} disconnected from Socket.io`);
            });
        }
    });
    logger_1.logger.info('Socket.io server configured');
    return io;
}
//# sourceMappingURL=socket.handler.js.map