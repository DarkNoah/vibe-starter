import { openai } from "@ai-sdk/openai";
import { createDeepSeek } from "@ai-sdk/deepseek";
import {
  streamText,
  convertToModelMessages,
  type UIMessage,
  LanguageModel,
} from "ai";
import mastra from "@/lib/mastra";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import providerManager from "@/lib/provider";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  return NextResponse.json(
    await providerManager.getProvider("jd76ra68mdndvdgkryd2fmebeh7r6ph7")
  );
}
