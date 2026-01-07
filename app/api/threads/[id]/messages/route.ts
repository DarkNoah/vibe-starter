import { getMastra } from "@/lib/mastra";
import { auth } from "@/auth";
import { type UIMessage } from "ai";
import { convertMessages } from "@mastra/core/agent";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
  const storage = getMastra().getStorage();
  const thread = await storage?.getThreadById({
    threadId: id,
  });
  if (thread?.resourceId && thread.resourceId !== userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
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
