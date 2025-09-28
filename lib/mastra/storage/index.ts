import { LibSQLStore } from "@mastra/libsql";
import { MastraStorage } from "@mastra/core";
import { PostgresStore } from "@mastra/pg";
import { UpstashStore } from "@mastra/upstash";
import { MSSQLStore } from "@mastra/mssql";
import fs from "fs";
import * as path from "path";

let storage: MastraStorage | null = null;

export const getStorage = () => {
  if (!storage) {
    switch (process.env.MASTRA_STORAGE_TYPE?.toLocaleLowerCase()) {
      case "libsql":
        const url =
          process.env.MASTRA_STORAGE_DATABASE_URL || "file:./.data/storage.db";
        const filePath = url.substring(url.indexOf("file:") + 5);
        const dirPath = path.dirname(filePath);
        fs.mkdirSync(dirPath, { recursive: true });
        storage = new LibSQLStore({
          url: process.env.MASTRA_STORAGE_DATABASE_URL as string,
        });
        break;
      case "pg":
        storage = new PostgresStore({
          connectionString: process.env.MASTRA_STORAGE_DATABASE_URL,
        });
      case "upstash":
        storage = new UpstashStore({
          url: process.env.MASTRA_STORAGE_DATABASE_URL as string,
          token: process.env.MASTRA_STORAGE_UPSTASH_TOKEN as string,
        });
      case "mssql":
        storage = new MSSQLStore({
          connectionString: process.env.MASTRA_STORAGE_DATABASE_URL as string,
        });
      default:
        throw new Error("Invalid storage type");
    }
  }
  return storage;
};
