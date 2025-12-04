import { Request, Response, NextFunction } from 'express';
import { clerkClient } from '../config/clerk';
import { AppError } from './error.middleware';
import { logger } from '../utils/logger';

// Extend Express Request type to include userId
declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export const authenticateRequest = async (
    req: Request,
    _res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError(401, 'No authorization token provided');
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token with Clerk
        try {
            const sessionClaims = await clerkClient.verifyToken(token);
            req.userId = sessionClaims.sub;
            next();
        } catch (error) {
            logger.error('Token verification failed:', error);
            throw new AppError(401, 'Invalid or expired token');
        }
    } catch (error) {
        next(error);
    }
};
