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
import { NextRequest, NextResponse } from "next/server";
import providerManager from "@/lib/provider";
import { MastraLanguageModel } from "@mastra/core";

export async function GET(req: Request) {
  const agents = mastra.getAgents();
  return NextResponse.json(
    Object.values(agents).map((agent) => {
      return {
        id: agent.id,
        name: agent.name,
      };
    }),
    { status: 200 }
  );
}
