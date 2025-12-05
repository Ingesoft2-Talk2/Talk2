/*
 * This file provides request validation middleware using Zod schemas.
 * It validates incoming request bodies against defined schemas and
 * returns formatted error messages for invalid requests.
 */

import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { AppError } from './error.middleware';

/**
 * Creates a validation middleware for Express routes.
 * This middleware validates request bodies against a Zod schema
 * and throws an AppError if validation fails.
 * 
 * @param schema - Zod schema to validate request body against
 * @returns Express middleware function
 */
export const validateRequest = (schema: ZodSchema) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        try {
            // Validate request body against schema
            schema.parse(req.body);
            next();
        } catch (error: any) {
            // Extract and format validation error messages
            const message = error.errors?.map((e: any) => e.message).join(', ') || 'Validation failed';
            throw new AppError(400, message);
        }
    };
};
