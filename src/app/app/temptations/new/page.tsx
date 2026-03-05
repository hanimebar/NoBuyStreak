"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Category, TriggerSource, Outcome } from "@/types";
import { useEffect } from "react";

const CATEGORIES: Category[] = ["clothing", "food", "tech", "beauty", "homewares", "other"];
const TRIGGERS: TriggerSource[] = ["instagram", "tiktok", "email", "in-store", "boredom", "other"];

function TemptationForm() {
  const searchParams = useSearchParams();
  const preselectedRuleId = searchParams.get("rule_id") ?? "";

  const [ruleId, setRuleId] = useState(preselectedRuleId);
  const [rules, setRules] = useState<{ id: string; name: string }[]>([]);
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState<Category>("clothing");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [triggerSource, setTriggerSource] = useState<TriggerSource | "">("");
  const [outcome, setOutcome] = useState<Outcome>("resisted");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("rules")
        .select("id, name")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .then(({ data }) => setRules(data ?? []));
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ruleId) { setError("Please select a rule."); return; }
    setLoading(true);
    setError("");

    const res = await fetch("/api/temptations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rule_id: ruleId,
        item_name: itemName,
        category,
        estimated_cost: estimatedCost ? parseFloat(estimatedCost) : null,
        trigger_source: triggerSource || null,
        outcome,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to log");
      setLoading(false);
      return;
    }

    window.location.href = ruleId ? `/app/rules/${ruleId}` : "/app/dashboard";
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-xl font-bold text-gray-900 mb-6">Log a temptation</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rule</label>
          <select
            value={ruleId}
            onChange={(e) => setRuleId(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a rule</option>
            {rules.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Item name</label>
          <input
            type="text"
            placeholder="e.g. Black midi dress from Zara"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Est. cost (€)</label>
            <input
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={estimatedCost}
              onChange={(e) => setEstimatedCost(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Trigger</label>
          <select
            value={triggerSource}
            onChange={(e) => setTriggerSource(e.target.value as TriggerSource | "")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select trigger (optional)</option>
            {TRIGGERS.map((t) => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Outcome</label>
          <div className="flex gap-3">
            {(["resisted", "slipped"] as Outcome[]).map((o) => (
              <label key={o} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value={o}
                  checked={outcome === o}
                  onChange={() => setOutcome(o)}
                  className="accent-blue-600"
                />
                <span className="text-sm text-gray-700 capitalize">{o}</span>
              </label>
            ))}
          </div>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-60 transition"
        >
          {loading ? "Saving…" : "Log temptation"}
        </button>
      </form>
    </div>
  );
}

export default function NewTemptationPage() {
  return (
    <Suspense>
      <TemptationForm />
    </Suspense>
  );
}
