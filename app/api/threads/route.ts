import { getMastra } from "@/lib/mastra";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
  const storage = getMastra().getStorage();
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
