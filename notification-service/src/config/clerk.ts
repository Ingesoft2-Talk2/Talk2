import { Clerk } from '@clerk/clerk-sdk-node';

if (!process.env.CLERK_SECRET_KEY) {
    throw new Error('CLERK_SECRET_KEY is not defined in environment variables');
}

export const clerkClient = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });
