"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("../utils/logger");
const connectDatabase = async () => {
    const mongoUrl = process.env.MONGO_URL;
    if (!mongoUrl) {
        logger_1.logger.error('MONGO_URL is not defined in environment variables');
        process.exit(1);
    }
    try {
        await mongoose_1.default.connect(mongoUrl);
        logger_1.logger.info('✅ MongoDB connected successfully');
    }
    catch (error) {
        logger_1.logger.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
    // Handle connection events
    mongoose_1.default.connection.on('disconnected', () => {
        logger_1.logger.warn('⚠️ MongoDB disconnected');
    });
    mongoose_1.default.connection.on('error', (error) => {
        logger_1.logger.error('MongoDB error:', error);
    });
};
exports.connectDatabase = connectDatabase;
//# sourceMappingURL=database.js.map