export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import CheckInButton from "@/components/CheckInButton";
import type { Checkin, TemptationLog } from "@/types";
import { formatCurrency } from "@/lib/currencies";

export default async function RuleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: rule } = await supabase
    .from("rules")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!rule) notFound();

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_pro, timezone, currency")
    .eq("id", user.id)
    .single();

  const isPro = profile?.is_pro ?? false;
  const timezone = profile?.timezone ?? "UTC";
  const currency = profile?.currency ?? "EUR";
  const today = new Date().toLocaleDateString("en-CA", { timeZone: timezone });

  const { data: checkins } = await supabase
    .from("checkins")
    .select("*")
    .eq("rule_id", id)
    .order("checked_date", { ascending: false })
    .limit(30);

  const { data: temptations } = await supabase
    .from("temptation_logs")
    .select("*")
    .eq("rule_id", id)
    .order("logged_at", { ascending: false })
    .limit(20);

  const todayCheckin = (checkins ?? []).find(
    (c: Checkin) => c.checked_date === today
  );

  const savings =
    rule.daily_spend_estimate && rule.current_streak > 0
      ? formatCurrency(rule.current_streak * rule.daily_spend_estimate, currency)
      : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/app/dashboard" className="text-sm text-gray-400 hover:text-gray-600">
            ← Dashboard
          </Link>
          <h1 className="text-xl font-bold text-gray-900 mt-1">{rule.name}</h1>
          <p className="text-xs text-gray-400 capitalize">{rule.category}</p>
        </div>
        {isPro && (
          <a
            href={`/api/card/${rule.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition"
          >
            Download card
          </a>
        )}
      </div>

      {/* Streak stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-4xl font-bold text-gray-900">{rule.current_streak}</div>
          <div className="text-xs text-gray-400 mt-1">current streak</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-4xl font-bold text-gray-900">{rule.longest_streak}</div>
          <div className="text-xs text-gray-400 mt-1">longest streak</div>
        </div>
      </div>

      {savings && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <p className="text-green-700 font-semibold">{savings} estimated saved</p>
        </div>
      )}

      {/* Today check-in */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <p className="text-sm font-medium text-gray-700 mb-3">Today</p>
        <CheckInButton
          ruleId={rule.id}
          checkedToday={todayCheckin?.held ?? null}
        />
      </div>

      {/* Check-in history */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Last 30 days</h2>
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {(checkins ?? []).length === 0 ? (
            <p className="text-sm text-gray-400 p-4">No check-ins yet.</p>
          ) : (
            (checkins ?? []).map((c: Checkin) => (
              <div key={c.id} className="flex items-center justify-between px-4 py-2.5">
                <span className="text-sm text-gray-600">{c.checked_date}</span>
                <span
                  className={`text-xs font-medium ${
                    c.held ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {c.held ? "Held" : "Slipped"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Temptation log */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-700">Temptations</h2>
          <Link
            href={`/app/temptations/new?rule_id=${rule.id}`}
            className="text-xs text-blue-600 hover:underline"
          >
            + Log one
          </Link>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {(temptations ?? []).length === 0 ? (
            <p className="text-sm text-gray-400 p-4">No temptations logged.</p>
          ) : (
            (temptations ?? []).map((t: TemptationLog) => (
              <div key={t.id} className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-800">{t.item_name}</span>
                  <span
                    className={`text-xs font-medium ${
                      t.outcome === "resisted" ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {t.outcome}
                  </span>
                </div>
                <div className="flex gap-3 mt-0.5 text-xs text-gray-400">
                  <span className="capitalize">{t.category}</span>
                  {t.estimated_cost && <span>{formatCurrency(t.estimated_cost, currency)}</span>}
                  {t.trigger_source && <span>{t.trigger_source}</span>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
