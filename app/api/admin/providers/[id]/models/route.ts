import { NextResponse } from "next/server";
import { getProviderManager } from "@/lib/provider";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const models = await getProviderManager().getModelList(id as string);
    return NextResponse.json(models ?? [], { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message ?? "Failed to load models" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return NextResponse.json(
    {
      error:
        "Provider updates are disabled because Convex has been removed. Configure models via environment variables instead.",
    },
    { status: 405 }
  );
}
