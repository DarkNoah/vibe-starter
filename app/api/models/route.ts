import providerManager from "@/lib/provider";
import { Provider, ProviderModel } from "@/types/provider";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const models: { id: string; name: string }[] = [];
  console.log(providerManager.providers);
  Object.entries(providerManager.providers)
    .filter((x: [string, Provider]) => x[1].isActive)
    .forEach((x: [string, Provider]) => {
      x[1].models
        .filter((y) => y.isActive)
        .forEach((y) => {
          models.push({ id: y.id + "@" + x[0], name: y.name });
        });
    });

  return NextResponse.json(models, { status: 200 });
}
