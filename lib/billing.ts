import "server-only";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db/drizzle";
import { userBilling } from "@/lib/db/schema";

export function isSubscriptionActive(status?: string | null) {
  return status === "active" || status === "trialing";
}

export async function getUserBillingStatus(userId: string) {
  const [user] = await db
    .select({
      stripeCustomerId: userBilling.stripeCustomerId,
      stripeSubscriptionId: userBilling.stripeSubscriptionId,
      stripePriceId: userBilling.stripePriceId,
      stripeSubscriptionStatus: userBilling.stripeSubscriptionStatus,
      stripeCurrentPeriodEnd: userBilling.stripeCurrentPeriodEnd,
    })
    .from(userBilling)
    .where(eq(userBilling.userId, userId))
    .limit(1);

  return user ?? null;
}
