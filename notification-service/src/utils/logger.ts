/*
 * This file provides a simple logging utility for the notification service.
 * It wraps console methods with formatted prefixes and supports different
 * log levels (info, error, warn, debug) with environment-based filtering.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

// Determine if running in development mode
const isDevelopment = process.env.NODE_ENV !== 'production';

/**
 * Logger utility object providing formatted logging methods.
 * Debug logs are only shown in development environment.
 */
export const logger = {
    /**
     * Logs informational messages.
     * @param message - The message to log
     * @param args - Additional arguments to log
     */
    info: (message: string, ...args: any[]) => {
        console.log(`[INFO] ${message}`, ...args);
    },

    /**
     * Logs error messages.
     * @param message - The error message to log
     * @param args - Additional error details to log
     */
    error: (message: string, ...args: any[]) => {
        console.error(`[ERROR] ${message}`, ...args);
    },

    /**
     * Logs warning messages.
     * @param message - The warning message to log
     * @param args - Additional warning details to log
     */
    warn: (message: string, ...args: any[]) => {
        console.warn(`[WARN] ${message}`, ...args);
    },

    /**
     * Logs debug messages (only in development environment).
     * @param message - The debug message to log
     * @param args - Additional debug information to log
     */
    debug: (message: string, ...args: any[]) => {
        if (isDevelopment) {
            console.log(`[DEBUG] ${message}`, ...args);
        }
    },
};
