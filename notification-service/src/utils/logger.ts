/* eslint-disable @typescript-eslint/no-explicit-any */
const isDevelopment = process.env.NODE_ENV !== 'production';

export const logger = {
    info: (message: string, ...args: any[]) => {
        console.log(`[INFO] ${message}`, ...args);
    },

    error: (message: string, ...args: any[]) => {
        console.error(`[ERROR] ${message}`, ...args);
    },

    warn: (message: string, ...args: any[]) => {
        console.warn(`[WARN] ${message}`, ...args);
    },

    debug: (message: string, ...args: any[]) => {
        if (isDevelopment) {
            console.log(`[DEBUG] ${message}`, ...args);
        }
    },
};
