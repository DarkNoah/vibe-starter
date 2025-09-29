import { openai } from "@ai-sdk/openai";
import { createDeepSeek } from "@ai-sdk/deepseek";
import {
  streamText,
  convertToModelMessages,
  type UIMessage,
  LanguageModel,
} from "ai";
import { getMastra } from "@/lib/mastra";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import providerManager from "@/lib/provider";
import { MastraLanguageModel } from "@mastra/core";
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const {
    message,
    model,
    webSearch,
    threadId,
  }: {
    message: UIMessage;
    model: string;
    webSearch: boolean;
    threadId: string;
  } = await req.json();

  const agent = getMastra().getAgentById("test-agent");
  agent.model = (await providerManager.getLanguageModel(
    model
  )) as MastraLanguageModel;
  const auth = getAuth(req as NextRequest);
  const { userId } = auth;
  const result = await (
    await agent.getMemory()
  )?.query({
    threadId: threadId,
  });

  const messages = convertToModelMessages([message]);
  const stream = await agent.streamVNext(messages, {
    format: "aisdk",
    memory: {
      thread: threadId, // Use actual user/session ID
      resource: userId!,
    },
    abortSignal: req.signal,
    onAbort: ({ steps }) => {
      // Handle cleanup when stream is aborted
      console.log("Stream aborted after", steps.length, "steps");
      // Persist partial results to database
    },
    onFinish: ({ steps, usage }) => {
      console.log("Stream finished after", steps.length, "steps");
      console.log("stream usage:", usage);
      // Persist final results to database
    },
    onStepFinish: (event) => {
      console.log("Step finished after", event);
    },
    onError: (error) => {
      console.log("Stream error:", error);
    },
  });

  const result2 = stream.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true,
    onFinish: ({ messages, responseMessage }) => {},
  });
  return result2;

  // const deepseek = createDeepSeek();
  // let llm: LanguageModel;
  // if (model.startsWith("deepseek/")) {
  //   llm = deepseek(model.split("/")[1]);
  // } else {
  //   llm = openai(model.split("/")[1]);
  // }
  // const result = streamText({
  //   model: llm,
  //   messages: convertToModelMessages(messages),
  // });

  // return result.toUIMessageStreamResponse({
  //   sendSources: true,
  //   sendReasoning: true,
  // });
}
