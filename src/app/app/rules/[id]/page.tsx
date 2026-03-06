export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import CheckInButton from "@/components/CheckInButton";
import StreakCalendar from "@/components/StreakCalendar";
import type { Checkin, TemptationLog } from "@/types";
import { formatCurrency } from "@/lib/currencies";

export default async function RuleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
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
    .limit(70);

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

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href="/app/dashboard" className="font-mono text-xs text-muted hover:text-amber transition">
            ← DASHBOARD
          </Link>
          <h1 className="font-retro text-3xl text-amber mt-1">{rule.name.toUpperCase()}</h1>
          <p className="font-mono text-xs text-muted uppercase mt-0.5">{rule.category}</p>
        </div>
        {isPro && (
          <a
            href={`/api/card/${rule.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 border border-amber text-amber font-retro text-sm px-3 py-1.5 hover:bg-amber hover:text-background transition"
          >
            DOWNLOAD CARD
          </a>
        )}
      </div>

      {/* Streak stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="border border-border bg-card p-4 text-center">
          <div className="font-retro text-5xl text-amber leading-none">{rule.current_streak}</div>
          <div className="font-mono text-xs text-muted mt-2 uppercase">Current streak</div>
        </div>
        <div className="border border-border bg-card p-4 text-center">
          <div className="font-retro text-5xl text-amber leading-none">{rule.longest_streak}</div>
          <div className="font-mono text-xs text-muted mt-2 uppercase">All-time best</div>
        </div>
      </div>

      {savings && (
        <div className="border border-retro-green bg-card p-4">
          <p className="font-mono text-sm text-retro-green">&gt; {savings} NOT SPENT — ESTIMATED SAVINGS</p>
        </div>
      )}

      {/* Today check-in */}
      <div className="border border-border bg-card p-4">
        <p className="font-mono text-xs text-muted uppercase tracking-wider mb-3">Today&apos;s check-in</p>
        <CheckInButton
          ruleId={rule.id}
          checkedToday={todayCheckin?.held ?? null}
        />
      </div>

      {/* Streak calendar heatmap */}
      <div className="border border-border bg-card p-4">
        <StreakCalendar checkins={checkins ?? []} timezone={timezone} />
      </div>

      {/* Temptation log */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="font-mono text-xs text-muted uppercase tracking-wider">Temptation log</p>
          <Link
            href={`/app/temptations/new?rule_id=${rule.id}`}
            className="font-mono text-xs text-amber hover:underline"
          >
            + LOG ONE
          </Link>
        </div>
        <div className="border border-border bg-card divide-y divide-border">
          {(temptations ?? []).length === 0 ? (
            <p className="font-mono text-xs text-muted p-4">&gt; No temptations logged. Either you&apos;re crushing it or you&apos;re in denial.</p>
          ) : (
            (temptations ?? []).map((t: TemptationLog) => (
              <div key={t.id} className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-foreground">{t.item_name}</span>
                  <span className={`font-retro text-sm ${t.outcome === "resisted" ? "text-retro-green" : "text-retro-red"}`}>
                    [{t.outcome.toUpperCase()}]
                  </span>
                </div>
                <div className="flex gap-3 mt-1 font-mono text-xs text-muted">
                  <span className="uppercase">{t.category}</span>
                  {t.estimated_cost && <span>{formatCurrency(t.estimated_cost, currency)}</span>}
                  {t.trigger_source && <span className="uppercase">{t.trigger_source}</span>}
                  <span>{new Date(t.logged_at).toLocaleDateString("en-CA", { timeZone: timezone })}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Check-in history list */}
      <div>
        <p className="font-mono text-xs text-muted uppercase tracking-wider mb-3">Recent check-ins</p>
        <div className="border border-border bg-card divide-y divide-border">
          {(checkins ?? []).length === 0 ? (
            <p className="font-mono text-xs text-muted p-4">&gt; No check-ins yet. Start today.</p>
          ) : (
            (checkins ?? []).slice(0, 14).map((c: Checkin) => (
              <div key={c.id} className="flex items-center justify-between px-4 py-2.5">
                <span className="font-mono text-sm text-foreground">{c.checked_date}</span>
                <span className={`font-retro text-sm ${c.held ? "text-retro-green" : "text-retro-red"}`}>
                  {c.held ? "[HELD]" : "[SLIPPED]"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
