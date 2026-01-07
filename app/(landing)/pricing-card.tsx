"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { PricingCardProps } from "@/types/stripe";

export default function PricingCard({
  productName,
  description,
  priceId,
  priceLabel,
  features = [],
}: PricingCardProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      if (response.status === 401) {
        window.location.assign(
          "/api/auth/signin?callbackUrl=/dashboard/payment-gated"
        );
        return;
      }
      if (!response.ok) {
        throw new Error("Checkout session failed");
      }
      const { url } = (await response.json()) as { url?: string };
      if (url) {
        window.location.assign(url);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 rounded-2xl border bg-background p-8 shadow-sm lg:grid-cols-[1.2fr_1fr] lg:items-center">
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {productName}
        </p>
        <h2 className="text-3xl font-semibold">{priceLabel}</h2>
        {description ? (
          <p className="text-muted-foreground">{description}</p>
        ) : null}
        {features.length ? (
          <div className="grid gap-2 text-sm text-muted-foreground">
            {features.map((feature) => (
              <p key={feature}>{feature}</p>
            ))}
          </div>
        ) : null}
      </div>
      <div className="space-y-4 rounded-xl border bg-muted/40 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Checkout is handled by Stripe
        </p>
        <Button className="w-full" onClick={handleCheckout} disabled={loading}>
          {loading ? "Redirecting..." : "Start subscription"}
        </Button>
        <p className="text-xs text-muted-foreground">
          You will be redirected to Stripe Checkout.
        </p>
      </div>
    </div>
  );
}
