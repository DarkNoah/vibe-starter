import { eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/lib/db/drizzle";
import { userBilling } from "@/lib/db/schema";
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

  const [user] = await db
    .select({
      stripeCustomerId: userBilling.stripeCustomerId,
    })
    .from(userBilling)
    .where(eq(userBilling.userId, session.user.id))
    .limit(1);

  if (!user?.stripeCustomerId) {
    return new Response("No Stripe customer found", { status: 400 });
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${getBaseUrl(req)}/dashboard`,
  });

  if (!portalSession.url) {
    return new Response("Stripe portal URL is missing", { status: 500 });
  }

  return Response.json({ url: portalSession.url });
}
