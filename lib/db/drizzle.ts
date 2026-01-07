import "server-only";
import postgres from "postgres";
import Database from "better-sqlite3";
import { drizzle as drizzlePg } from "drizzle-orm/postgres-js";
import { drizzle as drizzleSqlite } from "drizzle-orm/better-sqlite3";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

const isSqlite =
  process.env.DATABASE_DIALECT === "sqlite" ||
  databaseUrl.startsWith("file:") ||
  databaseUrl.startsWith("sqlite:");

function getSqliteFilename(url: string) {
  if (url.startsWith("file:")) return url.replace(/^file:/, "");
  if (url.startsWith("sqlite://")) return url.replace(/^sqlite:\/\//, "");
  if (url.startsWith("sqlite:")) return url.replace(/^sqlite:/, "");
  return url;
}

export const db = isSqlite
  ? drizzleSqlite(new Database(getSqliteFilename(databaseUrl)))
  : drizzlePg(postgres(databaseUrl));
