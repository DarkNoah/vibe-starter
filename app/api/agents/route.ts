import { getMastra } from "@/lib/mastra";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const agents = getMastra().getAgents();
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
