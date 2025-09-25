import mastra from "@/lib/mastra";
import { v4 as uuidv4 } from "uuid";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function POST(req: Request) {
  const { page = 1 } = await req.json();
  const auth = getAuth(req as NextRequest);
  const { userId } = auth;
  const storage = mastra.getStorage();
  const threads = await storage?.getThreadsByResourceIdPaginated({
    resourceId: userId!,
    page: page,
    perPage: 10,
  });

  return new Response(JSON.stringify(threads), { status: 200 });
}
