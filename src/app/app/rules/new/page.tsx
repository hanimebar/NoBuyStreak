"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/types";
import { CURRENCIES } from "@/lib/currencies";

const CATEGORIES: Category[] = [
  "clothing", "food", "drinks", "tech", "beauty", "homewares",
  "gaming", "gambling", "alcohol", "smoking", "trading", "other",
];

export default function NewRulePage() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>("clothing");
  const [dailySpend, setDailySpend] = useState("");
  const [currency, setCurrency] = useState("EUR");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.from("profiles").select("currency").single().then(({ data }) => {
      if (data?.currency) setCurrency(data.currency);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.href = "/login"; return; }

    // Check pro status + rule count
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_pro")
      .eq("id", user.id)
      .single();

    if (!profile?.is_pro) {
      const { count } = await supabase
        .from("rules")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_active", true);

      if ((count ?? 0) >= 1) {
        setError("Free plan allows 1 rule. Upgrade to Pro for unlimited rules.");
        setLoading(false);
        return;
      }
    }

    const { error: ruleError } = await supabase.from("rules").insert({
      user_id: user.id,
      name,
      category,
      daily_spend_estimate: dailySpend ? parseFloat(dailySpend) : null,
    });

    if (ruleError) {
      setError(ruleError.message);
      setLoading(false);
      return;
    }

    window.location.href = "/app/dashboard";
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-xl font-bold text-gray-900 mb-6">New rule</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rule name</label>
          <input
            type="text"
            placeholder="e.g. No new clothes"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Est. daily spend ({currency}){" "}
            <span className="text-gray-400 font-normal">— optional</span>
          </label>
          <input
            type="number"
            placeholder="0.00"
            min="0"
            step="0.01"
            value={dailySpend}
            onChange={(e) => setDailySpend(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => window.location.href = "/app/dashboard"}
            className="flex-1 border border-gray-300 text-gray-600 rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-60 transition"
          >
            {loading ? "Saving…" : "Create rule"}
          </button>
        </div>
      </form>
    </div>
  );
}
