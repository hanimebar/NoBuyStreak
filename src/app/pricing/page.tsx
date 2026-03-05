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
      if (data.error === "Unauthorized") {
        window.location.href = "/login";
      }
    }
    setLoading(null);
  }

  return (
    <div className="min-h-screen bg-white px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">← Home</Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Pricing</h1>
          <p className="text-gray-500 mt-2">Start free. Upgrade when you're ready.</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {/* Free */}
          <div className="border border-gray-200 rounded-2xl p-6">
            <h2 className="font-bold text-gray-900 text-lg">Free</h2>
            <p className="text-3xl font-bold my-3">€0</p>
            <ul className="text-sm text-gray-600 space-y-2 mb-6">
              <li>✓ 1 No Buy rule</li>
              <li>✓ Daily check-ins</li>
              <li>✓ Streak counter</li>
              <li>✓ Temptation log</li>
              <li className="text-gray-400">✗ Shareable cards</li>
              <li className="text-gray-400">✗ Lookback emails</li>
            </ul>
            <Link
              href="/login"
              className="block text-center border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
            >
              Get started
            </Link>
          </div>

          {/* Monthly */}
          <div className="border-2 border-blue-600 rounded-2xl p-6">
            <h2 className="font-bold text-gray-900 text-lg">Pro Monthly</h2>
            <p className="text-3xl font-bold my-3">€6<span className="text-base font-normal text-gray-400">/mo</span></p>
            <ul className="text-sm text-gray-600 space-y-2 mb-6">
              <li>✓ Unlimited rules</li>
              <li>✓ Daily check-ins</li>
              <li>✓ Streak counter</li>
              <li>✓ Temptation log</li>
              <li>✓ Shareable PNG cards</li>
              <li>✓ 30-day lookback emails</li>
            </ul>
            <button
              onClick={() => handleCheckout("monthly")}
              disabled={loading !== null}
              className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-60 transition"
            >
              {loading === "monthly" ? "Loading…" : "Subscribe monthly"}
            </button>
          </div>

          {/* Annual */}
          <div className="border border-gray-200 rounded-2xl p-6 relative">
            <span className="absolute top-4 right-4 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
              Save 46%
            </span>
            <h2 className="font-bold text-gray-900 text-lg">Pro Annual</h2>
            <p className="text-3xl font-bold my-3">€39<span className="text-base font-normal text-gray-400">/yr</span></p>
            <ul className="text-sm text-gray-600 space-y-2 mb-6">
              <li>✓ Unlimited rules</li>
              <li>✓ Daily check-ins</li>
              <li>✓ Streak counter</li>
              <li>✓ Temptation log</li>
              <li>✓ Shareable PNG cards</li>
              <li>✓ 30-day lookback emails</li>
            </ul>
            <button
              onClick={() => handleCheckout("annual")}
              disabled={loading !== null}
              className="w-full border border-blue-600 text-blue-600 rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-50 disabled:opacity-60 transition"
            >
              {loading === "annual" ? "Loading…" : "Subscribe annually"}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          All prices in EUR. Cancel anytime from settings. Questions?{" "}
          <a href="mailto:reachout@actvli.com" className="underline">reachout@actvli.com</a>
        </p>
      </div>
    </div>
  );
}
