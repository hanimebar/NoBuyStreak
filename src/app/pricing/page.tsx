"use client";

import { useState } from "react";
import Link from "next/link";

export default function PricingPage() {
  const [loading, setLoading] = useState<"monthly" | "annual" | null>(null);

  async function handleCheckout(plan: "monthly" | "annual") {
    setLoading(plan);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    if (res.ok) {
      const { url } = await res.json();
      window.location.href = url;
    } else {
      const data = await res.json();
      if (data.error === "Unauthorized") window.location.href = "/login";
    }
    setLoading(null);
  }

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <Link href="/" className="text-xs text-muted hover:text-amber">&lt;&lt; HOME</Link>
          <h1 className="font-retro text-5xl text-amber mt-4">PRICING</h1>
          <p className="text-muted mt-2">Start free. Upgrade when ready.</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {/* Free */}
          <div className="border border-border bg-card p-6">
            <h2 className="font-retro text-2xl text-foreground">FREE</h2>
            <p className="font-retro text-5xl text-amber my-3">€0</p>
            <ul className="text-sm text-muted space-y-2 mb-6">
              <li>&gt; 1 No Buy rule</li>
              <li>&gt; Daily check-ins</li>
              <li>&gt; Streak counter</li>
              <li>&gt; Temptation log</li>
              <li className="opacity-40">&gt; Shareable cards</li>
              <li className="opacity-40">&gt; Lookback emails</li>
            </ul>
            <Link
              href="/login"
              className="block text-center border border-border text-foreground px-4 py-2 text-sm hover:border-amber hover:text-amber transition"
            >
              GET STARTED
            </Link>
          </div>

          {/* Monthly */}
          <div className="border-2 border-amber bg-card p-6">
            <h2 className="font-retro text-2xl text-amber">PRO MONTHLY</h2>
            <p className="font-retro text-5xl text-amber my-3">€3<span className="text-xl text-muted">/mo</span></p>
            <ul className="text-sm text-foreground space-y-2 mb-6">
              <li>&gt; Unlimited rules</li>
              <li>&gt; Daily check-ins</li>
              <li>&gt; Streak counter</li>
              <li>&gt; Temptation log</li>
              <li>&gt; Shareable PNG cards</li>
              <li>&gt; 30-day lookback emails</li>
            </ul>
            <button
              onClick={() => handleCheckout("monthly")}
              disabled={loading !== null}
              className="w-full border border-amber text-amber font-retro text-lg px-4 py-2 hover:bg-amber hover:text-background disabled:opacity-40 transition"
            >
              {loading === "monthly" ? "LOADING..." : "[SUBSCRIBE]"}
            </button>
          </div>

          {/* Annual */}
          <div className="border border-border bg-card p-6 relative">
            <p className="absolute top-3 right-3 text-xs border border-retro-green text-retro-green px-2 py-0.5">
              SAVE 17%
            </p>
            <h2 className="font-retro text-2xl text-foreground">PRO ANNUAL</h2>
            <p className="font-retro text-5xl text-amber my-3">€30<span className="text-xl text-muted">/yr</span></p>
            <ul className="text-sm text-foreground space-y-2 mb-6">
              <li>&gt; Unlimited rules</li>
              <li>&gt; Daily check-ins</li>
              <li>&gt; Streak counter</li>
              <li>&gt; Temptation log</li>
              <li>&gt; Shareable PNG cards</li>
              <li>&gt; 30-day lookback emails</li>
            </ul>
            <button
              onClick={() => handleCheckout("annual")}
              disabled={loading !== null}
              className="w-full border border-amber text-amber font-retro text-lg px-4 py-2 hover:bg-amber hover:text-background disabled:opacity-40 transition"
            >
              {loading === "annual" ? "LOADING..." : "[SUBSCRIBE]"}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-muted mt-8">
          ALL PRICES IN EUR. CANCEL ANYTIME.{" "}
          <a href="mailto:reachout@actvli.com" className="text-amber hover:underline">
            reachout@actvli.com
          </a>
        </p>
      </div>
    </div>
  );
}
