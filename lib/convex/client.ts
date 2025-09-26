import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api.js";
import * as dotenv from "dotenv";
dotenv.config();

export const convexClient = new ConvexHttpClient(
  process.env["NEXT_PUBLIC_CONVEX_URL"] as string
);
