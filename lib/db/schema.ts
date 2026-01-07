import * as pg from "./schema.pg";
import * as sqlite from "./schema.sqlite";

const databaseUrl = process.env.DATABASE_URL ?? "";
const isSqlite =
  process.env.DATABASE_DIALECT === "sqlite" ||
  databaseUrl.startsWith("file:") ||
  databaseUrl.startsWith("sqlite:");

const schema = isSqlite ? sqlite : pg;

export const users = schema.users;
export const accounts = schema.accounts;
export const sessions = schema.sessions;
export const verificationTokens = schema.verificationTokens;
