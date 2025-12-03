/*
 * This file contains the configuration for the Next.js framework.
 * It defines settings such as image domains and other build-time options.
 */

import type { NextConfig } from "next";

/**
 * Configuration object for Next.js.
 * Specifies allowed remote patterns for images.
 */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev",
      },
    ],
  },
};

export default nextConfig;
