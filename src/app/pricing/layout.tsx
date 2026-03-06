import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Free & Pro Plans",
  description: "NoBuy Streak is free to start. Pro unlocks unlimited rules, shareable streak cards, and 30-day lookback emails. Cancel anytime.",
  alternates: { canonical: "https://nobuystreak.actvli.com/pricing" },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
