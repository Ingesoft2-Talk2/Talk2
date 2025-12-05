/*
 * This file defines error handling middleware and custom error classes.
 * It provides centralized error handling for the Express application,
 * formatting errors consistently and logging them appropriately.
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * Custom application error class for operational errors.
 * This class extends the native Error class and adds HTTP status code
 * and operational flag for distinguishing expected errors from bugs.
 */
export class AppError extends Error {
    /**
     * Creates a new AppError instance.
     * 
     * @param statusCode - HTTP status code for the error response
     * @param message - Human-readable error message
     * @param isOperational - Flag indicating if this is an expected operational error
     */
    constructor(
        public statusCode: number,
        public message: string,
        public isOperational = true
    ) {
        super(message);
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

/**
 * Global error handling middleware for Express.
 * This middleware catches all errors thrown in the application,
 * logs them, and sends appropriate HTTP responses to clients.
 * 
 * @param err - The error object (either Error or AppError)
 * @param _req - Express request object (unused)
 * @param res - Express response object
 * @param _next - Express next function (unused)
 */
export const errorHandler = (
    err: Error | AppError,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    logger.error('Error:', err);

    // Handle custom application errors
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            status: 'error',
            message: 'Validation error',
            details: err.message,
        });
    }

    // Handle Mongoose cast errors (invalid ObjectId format)
    if (err.name === 'CastError') {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid ID format',
        });
    }

    // Handle all other unexpected errors
    return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
    });
};
