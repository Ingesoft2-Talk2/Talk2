/*
 * This file initializes and exports the Prisma client instance.
 * It ensures that a single instance of PrismaClient is used across the application,
 * preventing multiple connections in development mode.
 */
import { PrismaClient } from "../../generated/prisma";

/**
 * Global object to store the Prisma client instance in development.
 * This prevents exhausting database connections during hot reloads.
 */
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * The exported Prisma client instance.
 * Reuses the existing instance if available, otherwise creates a new one.
 */
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
