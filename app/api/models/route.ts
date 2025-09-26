import providerManager from "@/lib/provider";
import { Provider, ProviderModel } from "@/types/provider";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const models = await providerManager.getAvailableModels();
  return NextResponse.json(models, { status: 200 });
}
