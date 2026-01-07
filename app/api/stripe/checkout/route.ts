import { eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/lib/db/drizzle";
import { userBilling, users } from "@/lib/db/schema";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

function getBaseUrl(req: Request) {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.AUTH_URL ||
    req.headers.get("origin") ||
    "http://localhost:3000"
  );
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json().catch(() => ({} as { priceId?: string }));
  const requestedPriceId =
    typeof body?.priceId === "string" ? body.priceId : undefined;
  const priceId = requestedPriceId;
  if (!priceId) {
    return new Response("STRIPE_PRICE_ID is not set", { status: 500 });
  }

  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      stripeCustomerId: userBilling.stripeCustomerId,
    })
    .from(users)
    .leftJoin(userBilling, eq(userBilling.userId, users.id))
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  let customerId = user.stripeCustomerId ?? undefined;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
      name: user.name ?? undefined,
      metadata: {
        userId: user.id,
      },
    });
    customerId = customer.id;
    await db
      .insert(userBilling)
      .values({
        userId: user.id,
        stripeCustomerId: customerId,
      })
      .onConflictDoUpdate({
        target: userBilling.userId,
        set: { stripeCustomerId: customerId },
      });
  }

  const baseUrl = getBaseUrl(req);
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    client_reference_id: user.id,
    allow_promotion_codes: true,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${baseUrl}/dashboard?billing=success`,
    cancel_url: `${baseUrl}/dashboard/payment-gated?billing=cancel`,
    subscription_data: {
      metadata: {
        userId: user.id,
      },
    },
  });

  if (!checkoutSession.url) {
    return new Response("Stripe session URL is missing", { status: 500 });
  }

  return Response.json({ url: checkoutSession.url });
}
