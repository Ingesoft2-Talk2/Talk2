/*
 * This file configures the Prisma ORM for the application.
 * It sets up the database connection and schema location.
 */

import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

// Load environment variables from .env file
dotenv.config({ path: ".env" });

/**
 * The database connection URL retrieved from environment variables.
 */
const postgresUrl = process.env.PRISMA_DATABASE_URL;

if (!postgresUrl) {
  throw new Error("The environment variable PRISMA_DATABASE_URL must be set.");
}

/**
 * Export the Prisma configuration object.
 * Defines the schema path, migration path, and datasource URL.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: postgresUrl,
  },
});
