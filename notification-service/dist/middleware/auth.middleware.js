"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateRequest = void 0;
const clerk_1 = require("../config/clerk");
const error_middleware_1 = require("./error.middleware");
const logger_1 = require("../utils/logger");
const authenticateRequest = async (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new error_middleware_1.AppError(401, 'No authorization token provided');
        }
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        // Verify token with Clerk
        try {
            const sessionClaims = await clerk_1.clerkClient.verifyToken(token);
            req.userId = sessionClaims.sub;
            next();
        }
        catch (error) {
            logger_1.logger.error('Token verification failed:', error);
            throw new error_middleware_1.AppError(401, 'Invalid or expired token');
        }
    }
    catch (error) {
        next(error);
    }
};
exports.authenticateRequest = authenticateRequest;
//# sourceMappingURL=auth.middleware.js.map