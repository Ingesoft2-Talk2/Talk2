"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const database_1 = require("./config/database");
const socket_handler_1 = require("./socket/socket.handler");
const notification_service_1 = require("./services/notification.service");
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const logger_1 = require("./utils/logger");
// Initialize Express app
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// Middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
// Health check
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', service: 'notification-service' });
});
// Routes
app.use('/api/notifications', notification_routes_1.default);
// Error handling middleware (must be last)
app.use(error_middleware_1.errorHandler);
// Initialize server
async function startServer() {
    try {
        // Connect to MongoDB
        await (0, database_1.connectDatabase)();
        // Setup Socket.io
        const io = (0, socket_handler_1.setupSocketServer)(server);
        (0, notification_service_1.setSocketServer)(io);
        // Start server
        const PORT = process.env.PORT || 4000;
        server.listen(PORT, () => {
            logger_1.logger.info(`🚀 Notification Service running on port ${PORT}`);
            logger_1.logger.info(`📧 Email notifications enabled`);
            logger_1.logger.info(`🔌 Socket.io enabled for real-time notifications`);
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to start server:', error);
        process.exit(1);
    }
}
// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
    logger_1.logger.error('Unhandled Promise Rejection:', error);
    process.exit(1);
});
// Start the server
startServer();
//# sourceMappingURL=index.js.map