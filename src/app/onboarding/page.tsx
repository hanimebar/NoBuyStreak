"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/types";
import { CURRENCIES } from "@/lib/currencies";

const CATEGORIES: Category[] = [
  "clothing", "food", "drinks", "tech", "beauty", "homewares",
  "gaming", "gambling", "alcohol", "smoking", "trading", "other",
];

export default function OnboardingPage() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>("clothing");
  const [dailySpend, setDailySpend] = useState("");
  const [currency, setCurrency] = useState("EUR");
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

    await supabase.from("profiles").update({ timezone, currency }).eq("id", user.id);

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
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="text-muted text-xs tracking-widest mb-2">C:\NOBUY&gt; new_rule.exe</p>
          <h1 className="font-retro text-4xl text-amber">SET YOUR FIRST RULE</h1>
          <p className="text-muted mt-1 text-sm">&gt; WHAT ARE YOU NOT BUYING?</p>
        </div>

        <form onSubmit={handleSubmit} className="border border-border bg-card p-6 space-y-4">
          <div>
            <label className="block text-xs text-muted mb-1 uppercase tracking-wider">Rule name</label>
            <input
              type="text"
              placeholder="e.g. No new clothes"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-background border border-border text-foreground placeholder-muted px-3 py-2 text-sm font-mono focus:outline-none focus:border-amber"
            />
          </div>

          <div>
            <label className="block text-xs text-muted mb-1 uppercase tracking-wider">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full bg-background border border-border text-foreground px-3 py-2 text-sm font-mono focus:outline-none focus:border-amber"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c.toUpperCase()}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-muted mb-1 uppercase tracking-wider">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-background border border-border text-foreground px-3 py-2 text-sm font-mono focus:outline-none focus:border-amber"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-muted mb-1 uppercase tracking-wider">
              Est. daily spend ({currency}) — optional
            </label>
            <input
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={dailySpend}
              onChange={(e) => setDailySpend(e.target.value)}
              className="w-full bg-background border border-border text-foreground placeholder-muted px-3 py-2 text-sm font-mono focus:outline-none focus:border-amber"
            />
          </div>

          {error && <p className="text-retro-red text-sm font-mono">&gt; ERROR: {error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full border border-amber text-amber font-retro text-xl px-4 py-2 hover:bg-amber hover:text-background disabled:opacity-40 transition"
          >
            {loading ? "SAVING..." : "[START MY STREAK]"}
          </button>
        </form>
      </div>
    </div>
  );
}
