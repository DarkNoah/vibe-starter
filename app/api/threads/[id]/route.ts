import { getMastra } from "@/lib/mastra";
import { v4 as uuidv4 } from "uuid";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const auth = getAuth(req as NextRequest);
  const { userId } = auth;
  const storage = getMastra().getStorage();
  const thread = await storage?.getThreadById({ threadId: id });
  if (thread?.resourceId !== userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
  await storage?.deleteThread({
    threadId: id,
  });

  return new Response(JSON.stringify({}), { status: 200 });
}
