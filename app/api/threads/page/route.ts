import { getMastra } from "@/lib/mastra";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const { page = 0 } = await req.json();
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
  const storage = getMastra().getStorage();
  const threads = await storage?.getThreadsByResourceIdPaginated({
    resourceId: userId!,
    page: page,
    perPage: 10,
  });

  return new Response(JSON.stringify(threads), { status: 200 });
}
