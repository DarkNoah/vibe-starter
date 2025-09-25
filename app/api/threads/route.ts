import mastra from "@/lib/mastra";
import { v4 as uuidv4 } from "uuid";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function POST(req: Request) {
  const auth = getAuth(req as NextRequest);
  const { userId } = auth;
  const storage = mastra.getStorage();
  const thread = await storage?.saveThread({
    thread: {
      id: uuidv4(),
      resourceId: userId!,
      title: "New Thread",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  return new Response(JSON.stringify(thread), { status: 200 });
}
