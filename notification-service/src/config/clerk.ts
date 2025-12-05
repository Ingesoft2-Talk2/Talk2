/*
 * This file configures the Clerk authentication client for the notification service.
 * It initializes the Clerk SDK with the secret key from environment variables
 * and validates that the required configuration is present.
 */

import { Clerk } from '@clerk/clerk-sdk-node';

// Validate that Clerk secret key is provided
if (!process.env.CLERK_SECRET_KEY) {
    throw new Error('CLERK_SECRET_KEY is not defined in environment variables');
}

/**
 * Clerk client instance for authentication and user management.
 * This client is used to verify JWT tokens and fetch user information.
 */
export const clerkClient = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });
