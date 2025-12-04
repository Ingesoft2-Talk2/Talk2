"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailTransporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('EMAIL_USER and EMAIL_PASS must be defined in environment variables');
}
exports.emailTransporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
// Verify transporter configuration
exports.emailTransporter.verify((error) => {
    if (error) {
        console.error('❌ Email transporter error:', error);
    }
    else {
        console.log('✅ Email transporter ready');
    }
});
//# sourceMappingURL=email.js.map