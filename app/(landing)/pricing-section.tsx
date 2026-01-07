"use client";

import { useEffect, useState } from "react";
import PricingCard from "./pricing-card";
import type {
  StripePriceSummary,
  StripeProductSummary,
  StripeProductsResponse,
} from "@/types/stripe";
import Stripe from "stripe";

function formatPrice(price: StripePriceSummary) {
  if (price.unitAmount == null) return "Contact us";
  const amount = price.unitAmount / 100;
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency.toUpperCase(),
    maximumFractionDigits: 2,
  }).format(amount);
  if (!price.recurringInterval) return formatted;
  const count = price.recurringIntervalCount ?? 1;
  const interval =
    count === 1
      ? price.recurringInterval
      : `${count} ${price.recurringInterval}s`;
  return `${formatted} / ${interval}`;
}

export default function PricingSection() {
  const [products, setProducts] = useState<StripeProductSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const response = await fetch(
          `/api/stripe/products?type=${"recurring" as Stripe.Price.Type}`
        );
        if (!response.ok) return;
        const data = (await response.json()) as StripeProductsResponse;
        if (isMounted) {
          setProducts(data.products ?? []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const cards = products
    .map((product) => {
      const recurringPrice = product.prices.find(
        (price) => price.recurringInterval
      );
      if (!recurringPrice) return null;
      return {
        product,
        price: recurringPrice,
      };
    })
    .filter(Boolean) as {
    product: StripeProductSummary;
    price: StripePriceSummary;
  }[];

  return (
    <section className="bg-muted/50 py-16 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 mx-auto max-w-2xl space-y-4 text-center">
          <h1 className="text-center text-4xl font-semibold lg:text-5xl">
            Simple pricing for focused teams
          </h1>
          <p className="text-muted-foreground">
            Plans are synced from Stripe. Checkout is handled by Stripe.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {loading ? (
            <div className="rounded-2xl border bg-background p-8 text-center text-muted-foreground">
              Loading plans...
            </div>
          ) : cards.length ? (
            cards.map(({ product, price }) => (
              <PricingCard
                key={price.id}
                productName={product.name}
                description={product.description}
                priceId={price.id}
                priceLabel={formatPrice(price)}
                features={price.nickname ? [price.nickname] : []}
              />
            ))
          ) : (
            <div className="rounded-2xl border bg-background p-8 text-center text-muted-foreground">
              No active subscription plans found.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
