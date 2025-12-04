import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { AppError } from './error.middleware';

export const validateRequest = (schema: ZodSchema) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error: any) {
            const message = error.errors?.map((e: any) => e.message).join(', ') || 'Validation failed';
            throw new AppError(400, message);
        }
    };
};
