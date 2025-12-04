"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const isDevelopment = process.env.NODE_ENV !== 'production';
exports.logger = {
    info: (message, ...args) => {
        console.log(`[INFO] ${message}`, ...args);
    },
    error: (message, ...args) => {
        console.error(`[ERROR] ${message}`, ...args);
    },
    warn: (message, ...args) => {
        console.warn(`[WARN] ${message}`, ...args);
    },
    debug: (message, ...args) => {
        if (isDevelopment) {
            console.log(`[DEBUG] ${message}`, ...args);
        }
    },
};
//# sourceMappingURL=logger.js.map