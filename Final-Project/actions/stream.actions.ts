/*
 * This file contains server actions related to Stream.io integration.
 * It handles token generation for authenticated users.
 */

"use server";

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";

/**
 * API key for Stream.io, retrieved from environment variables.
 */
const STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;

/**
 * API secret for Stream.io, retrieved from environment variables.
 */
const STREAM_API_SECRET = process.env.STREAM_SECRET_KEY;

/**
 * Generates a Stream.io token for the current authenticated user.
 *
 * @returns A promise that resolves to the generated token string.
 * @throws Error if the user is not authenticated or if API keys are missing.
 */
export const tokenProvider = async () => {
  const user = await currentUser();

  if (!user) throw new Error("User is not authenticated");
  if (!STREAM_API_KEY) throw new Error("Stream API key secret is missing");
  if (!STREAM_API_SECRET) throw new Error("Stream API secret is missing");

  const streamClient = new StreamClient(STREAM_API_KEY, STREAM_API_SECRET);

  const expirationTime = Math.floor(Date.now() / 1000) + 3600;
  const issuedAt = Math.floor(Date.now() / 1000) - 60;

  const token = streamClient.createToken(user.id, expirationTime, issuedAt);

  return token;
};
