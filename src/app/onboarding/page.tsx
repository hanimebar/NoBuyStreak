"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/types";

const CATEGORIES: Category[] = ["clothing", "food", "tech", "beauty", "homewares", "other"];

export default function OnboardingPage() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>("clothing");
  const [dailySpend, setDailySpend] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.href = "/login"; return; }

    // Save timezone to profile
    await supabase.from("profiles").update({ timezone }).eq("id", user.id);

    // Create first rule
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Set your first rule</h1>
          <p className="text-gray-500 mt-1">What are you committing to not buy?</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
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
              Estimated daily spend (€) <span className="text-gray-400 font-normal">— optional, for money-saved tracking</span>
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-60 transition"
          >
            {loading ? "Saving…" : "Start my streak"}
          </button>
        </form>
      </div>
    </div>
  );
}
