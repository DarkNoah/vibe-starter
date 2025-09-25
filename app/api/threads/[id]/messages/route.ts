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
import { isUiMessage } from "@mastra/core";
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const auth = getAuth(req as NextRequest);
  const { userId } = auth;

  // const res = await mastra.getMemory()?.query({
  //   threadId: params.id,
  //   resourceId: userId!,
  //   selectBy: {
  //     pagination: {
  //       page: 0,
  //       perPage: 10,
  //     },
  //   },
  // });

  const storage = mastra.getStorage();
  const thread = await storage?.getThreadById({
    threadId: params.id,
  });

  const res = await storage?.getMessagesPaginated({
    format: "v2",
    threadId: params.id,
    // selectBy: {
    //   pagination: {
    //     page: 0,
    //     perPage: 10,
    //   },
    // },
  });
  const data = { ...res, messages: [] };
  data.messages = res?.messages?.map((m) => {
    return {
      id: m.id,
      role: m.role,
      parts: m.content.parts,
    } as UIMessage;
  });

  return new Response(JSON.stringify(data), { status: 200 });
}
