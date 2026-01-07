import type Stripe from "stripe";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db/drizzle";
import { userBilling } from "@/lib/db/schema";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

function toDate(seconds?: number | null) {
  if (!seconds) return null;
  return new Date(seconds * 1000);
}

async function upsertSubscriptionByCustomer(
  subscription: Stripe.Subscription
) {
  const customerId = subscription.customer as string | null;
  if (!customerId) return;

  const priceId = subscription.items.data[0]?.price?.id ?? null;
  await db
    .update(userBilling)
    .set({
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      stripeSubscriptionStatus: subscription.status,
      stripeCurrentPeriodEnd: toDate(subscription.current_period_end),
    })
    .where(eq(userBilling.stripeCustomerId, customerId));

  const userId = subscription.metadata?.userId;
  if (userId) {
    await db
      .insert(userBilling)
      .values({
        userId,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscription.id,
        stripePriceId: priceId,
        stripeSubscriptionStatus: subscription.status,
        stripeCurrentPeriodEnd: toDate(subscription.current_period_end),
      })
      .onConflictDoUpdate({
        target: userBilling.userId,
        set: {
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscription.id,
          stripePriceId: priceId,
          stripeSubscriptionStatus: subscription.status,
          stripeCurrentPeriodEnd: toDate(subscription.current_period_end),
        },
      });
  }
}

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing stripe-signature", { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return new Response("STRIPE_WEBHOOK_SECRET is not set", { status: 500 });
  }

  const payload = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(`Webhook error: ${message}`, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode !== "subscription") {
        break;
      }
      const userId = session.client_reference_id ?? session.metadata?.userId;
      if (!userId) {
        break;
      }
      const subscriptionId = session.subscription as string | null;
      let subscription: Stripe.Subscription | null = null;
      if (subscriptionId) {
        subscription = await stripe.subscriptions.retrieve(subscriptionId);
      }

      await db
        .insert(userBilling)
        .values({
          userId,
          stripeCustomerId: (session.customer as string | null) ?? null,
          stripeSubscriptionId: subscriptionId,
          stripePriceId: subscription?.items.data[0]?.price?.id ?? null,
          stripeSubscriptionStatus: subscription?.status ?? "active",
          stripeCurrentPeriodEnd: toDate(subscription?.current_period_end ?? null),
        })
        .onConflictDoUpdate({
          target: userBilling.userId,
          set: {
            stripeCustomerId: (session.customer as string | null) ?? null,
            stripeSubscriptionId: subscriptionId,
            stripePriceId: subscription?.items.data[0]?.price?.id ?? null,
            stripeSubscriptionStatus: subscription?.status ?? "active",
            stripeCurrentPeriodEnd: toDate(subscription?.current_period_end ?? null),
          },
        });
      break;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await upsertSubscriptionByCustomer(subscription);
      break;
    }
    default:
      break;
  }

  return new Response(null, { status: 200 });
}
