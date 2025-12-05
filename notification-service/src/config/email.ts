/*
 * This file configures the SendGrid email service for sending notifications.
 * It initializes the SendGrid client with API credentials and validates
 * required environment variables.
 */

import sgMail from '@sendgrid/mail';
import { logger } from '../utils/logger';

// Read SendGrid configuration from environment variables
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL_VALUE = process.env.FROM_EMAIL || process.env.EMAIL_USER;

// Validate required SendGrid API key
if (!SENDGRID_API_KEY) {
    throw new Error('SENDGRID_API_KEY must be defined in environment variables');
}

// Validate required sender email address
if (!FROM_EMAIL_VALUE) {
    throw new Error('FROM_EMAIL or EMAIL_USER must be defined in environment variables');
}

// Initialize SendGrid client with API key
sgMail.setApiKey(SENDGRID_API_KEY);

// Export sender email address as non-undefined string
export const FROM_EMAIL: string = FROM_EMAIL_VALUE;
export { sgMail };

logger.info('✅ SendGrid email service initialized');
logger.info(`📧 Sending emails from: ${FROM_EMAIL}`);
