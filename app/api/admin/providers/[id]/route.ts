import providerManager from "@/lib/provider";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const provider = await providerManager.getProvider(params.id, true);
    return NextResponse.json(provider, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message ?? "Failed to load provider" },
      { status: 500 }
    );
  }
}
