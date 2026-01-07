import { getProviderManager } from "@/lib/provider";
import { Provider, ProviderModel } from "@/types/provider";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  console.log("get models");
  const models = await getProviderManager().getAvailableModels();
  return NextResponse.json(models, { status: 200 });
}
