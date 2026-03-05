import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-08-27.basil",
    });
  }
  return stripeInstance;
}

export const PLANS = {
  monthly: {
    priceId: process.env.STRIPE_MONTHLY_PRICE_ID!,
    price: 6,
    currency: "eur",
    interval: "month" as const,
    label: "€6/month",
  },
  annual: {
    priceId: process.env.STRIPE_ANNUAL_PRICE_ID!,
    price: 39,
    currency: "eur",
    interval: "year" as const,
    label: "€39/year",
  },
};
