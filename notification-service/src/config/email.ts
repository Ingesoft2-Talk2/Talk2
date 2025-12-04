import sgMail from '@sendgrid/mail';
import { logger } from '../utils/logger';

// Check if SendGrid API key is provided
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL_VALUE = process.env.FROM_EMAIL || process.env.EMAIL_USER;

if (!SENDGRID_API_KEY) {
    throw new Error('SENDGRID_API_KEY must be defined in environment variables');
}

if (!FROM_EMAIL_VALUE) {
    throw new Error('FROM_EMAIL or EMAIL_USER must be defined in environment variables');
}

// Initialize SendGrid
sgMail.setApiKey(SENDGRID_API_KEY);

// Export FROM_EMAIL as non-undefined string
export const FROM_EMAIL: string = FROM_EMAIL_VALUE;
export { sgMail };

logger.info('✅ SendGrid email service initialized');
logger.info(`📧 Sending emails from: ${FROM_EMAIL}`);
