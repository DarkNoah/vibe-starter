import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

const databaseUrl = process.env.DATABASE_URL ?? "";
const isSqlite =
  process.env.DATABASE_DIALECT === "sqlite" ||
  databaseUrl.startsWith("file:") ||
  databaseUrl.startsWith("sqlite:");

export default defineConfig({
  schema: isSqlite ? "./lib/db/schema.sqlite.ts" : "./lib/db/schema.pg.ts",
  out: isSqlite ? "./lib/db/migrations/sqlite" : "./lib/db/migrations/pg",
  dialect: isSqlite ? "sqlite" : "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
