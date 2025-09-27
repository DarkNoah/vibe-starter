import mastra from "@/lib/mastra";
import { v4 as uuidv4 } from "uuid";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import {
  streamText,
  convertToModelMessages,
  type UIMessage,
  LanguageModel,
} from "ai";
import { convertMessages } from "@mastra/core/agent";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const auth = getAuth(req as NextRequest);
  const { userId } = auth;
  const storage = mastra.getStorage();
  const thread = await storage?.getThreadById({
    threadId: id,
  });
  const res = await storage?.getMessagesPaginated({
    format: "v2",
    threadId: id,
    // selectBy: {
    //   pagination: {
    //     page: 0,
    //     perPage: 10,
    //   },
    // },
  });
  const data = { ...res, messages: [] } as { messages: UIMessage[] };
  data.messages = convertMessages(res?.messages || []).to("AIV5.UI");

  return new Response(JSON.stringify(data), { status: 200 });
}
