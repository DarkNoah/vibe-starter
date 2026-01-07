import Stripe from "stripe";

export type StripePriceSummary = {
  id: string;
  currency: string;
  unitAmount: number | null;
  recurringInterval: Stripe.Price.Recurring.Interval | null;
  recurringIntervalCount: number | null;
  nickname: string | null;
  trialPeriodDays: number | null;
  type: Stripe.Price.Type;
};

export type StripeProductSummary = {
  id: string;
  name: string;
  description: string | null;
  images: string[];
  prices: StripePriceSummary[];
};

export type StripeProductsResponse = {
  products: StripeProductSummary[];
};

export type PricingCardProps = {
  productName: string;
  description?: string | null;
  priceId: string;
  priceLabel: string;
  features?: string[];
};
