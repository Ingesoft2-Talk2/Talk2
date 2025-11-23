import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

dotenv.config({ path: ".env" });

const postgresUrl = process.env.PRISMA_DATABASE_URL;

if (!postgresUrl) {
  throw new Error("The environment variable PRISMA_DATABASE_URL must be set.");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: postgresUrl,
  },
});
