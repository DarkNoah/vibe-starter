import { NextResponse } from "next/server";
import providerManager from "@/lib/provider";
import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import type { ProviderModel } from "@/types/provider";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const models = await providerManager.getModelList(params.id);
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
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const incoming: ProviderModel[] = Array.isArray(body)
      ? body
      : Array.isArray(body?.models)
        ? body.models
        : [];

    if (!Array.isArray(incoming)) {
      return NextResponse.json(
        {
          error:
            "Invalid payload. Expect an array of models or { models: [...] }",
        },
        { status: 400 }
      );
    }

    const client = new ConvexHttpClient(
      process.env["NEXT_PUBLIC_CONVEX_URL"] as string
    );

    await client.mutation(api.providers.updateModels, {
      id: params.id as any,
      patch: {
        models: incoming,
      },
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message ?? "Failed to update models" },
      { status: 500 }
    );
  }
}
