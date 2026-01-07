import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { StripeProductSummary } from "@/types/stripe";

export const runtime = "nodejs";
export const revalidate = 60;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const typeParam = searchParams.get("type") as Stripe.Price.Type | null;
  if (!typeParam) {
    return new Response("Invalid type filter", { status: 400 });
  }

  const [products, prices] = await Promise.all([
    stripe.products.list({ active: true, limit: 100 }),
    stripe.prices.list({ active: true, limit: 100, expand: ["data.product"] }),
  ]);

  const productMap = new Map<string, StripeProductSummary>();
  for (const product of products.data) {
    productMap.set(product.id, {
      id: product.id,
      name: product.name,
      description: product.description ?? null,
      images: product.images ?? [],
      prices: [],
    });
  }

  for (const price of prices.data) {
    const product =
      typeof price.product === "string"
        ? productMap.get(price.product)
        : price.product
        ? productMap.get(price.product.id)
        : null;

    if (!product) continue;

    if (price.type !== typeParam) {
      continue;
    }

    product.prices.push({
      id: price.id,
      currency: price.currency,
      unitAmount: price.unit_amount ?? null,
      recurringInterval: price.recurring?.interval ?? null,
      recurringIntervalCount: price.recurring?.interval_count ?? null,
      nickname: price.nickname ?? null,
      type: price.type,
      trialPeriodDays: price.recurring?.trial_period_days ?? null,
    });
  }

  return Response.json({
    products: Array.from(productMap.values()).filter(
      (product) => product.prices.length > 0
    ),
  });
}
