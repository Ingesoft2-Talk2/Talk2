/*
 * This file defines the middleware for the application, primarily handling authentication
 * using Clerk. It protects routes and manages access control.
 */

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/**
 * Matcher for public routes that do not require authentication.
 */
const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

/**
 * Middleware function exported by Clerk to handle authentication.
 * It checks if the current route is public; if not, it enforces authentication.
 */
export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

/**
 * Configuration for the middleware matcher.
 * Specifies which paths the middleware should run on.
 */
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
