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
    price: 3,
    currency: "eur",
    interval: "month" as const,
    label: "€3/month",
  },
  annual: {
    priceId: process.env.STRIPE_ANNUAL_PRICE_ID!,
    price: 30,
    currency: "eur",
    interval: "year" as const,
    label: "€30/year",
  },
};
