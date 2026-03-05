export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import CheckInButton from "@/components/CheckInButton";
import type { Rule } from "@/types";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ upgraded?: string }>;
}) {
  const { upgraded } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: rules } = await supabase
    .from("rules")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_pro, timezone")
    .eq("id", user.id)
    .single();

  const isPro = profile?.is_pro ?? false;
  const timezone = profile?.timezone ?? "UTC";

  const today = new Date().toLocaleDateString("en-CA", { timeZone: timezone });
  const ruleIds = (rules ?? []).map((r: Rule) => r.id);

  let todayCheckins: Record<string, boolean | null> = {};
  if (ruleIds.length > 0) {
    const { data: checkins } = await supabase
      .from("checkins")
      .select("rule_id, held")
      .in("rule_id", ruleIds)
      .eq("checked_date", today);

    for (const c of checkins ?? []) {
      todayCheckins[c.rule_id] = c.held;
    }
  }

  return (
    <div>
      {upgraded && (
        <div className="mb-6 p-4 border border-retro-green text-retro-green text-sm font-mono">
          &gt; PRO ACTIVATED. Unlimited rules + shareable cards unlocked.
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="font-retro text-3xl text-amber">YOUR RULES</h1>
        {!isPro && (
          <Link
            href="/pricing"
            className="text-xs border border-amber text-amber px-3 py-1 hover:bg-amber hover:text-background transition"
          >
            UPGRADE TO PRO
          </Link>
        )}
      </div>

      {(!rules || rules.length === 0) ? (
        <div className="text-center py-16 border border-border">
          <p className="text-muted mb-4 font-retro text-xl">&gt; NO RULES FOUND</p>
          <Link
            href="/onboarding"
            className="border border-amber text-amber px-4 py-2 text-sm hover:bg-amber hover:text-background transition"
          >
            CREATE FIRST RULE
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {rules.map((rule: Rule) => {
            const checkedToday = todayCheckins[rule.id];
            const savings =
              rule.daily_spend_estimate && rule.current_streak > 0
                ? `€${(rule.current_streak * rule.daily_spend_estimate).toFixed(0)} SAVED`
                : null;

            return (
              <div key={rule.id} className="border border-border bg-card p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <Link
                      href={`/app/rules/${rule.id}`}
                      className="font-retro text-xl text-amber hover:text-foreground transition"
                    >
                      {rule.name.toUpperCase()}
                    </Link>
                    <p className="text-xs text-muted uppercase mt-0.5">{rule.category}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-retro text-5xl text-amber leading-none">
                      {rule.current_streak}
                    </div>
                    <div className="text-xs text-muted mt-1">DAY STREAK</div>
                  </div>
                </div>

                {savings && (
                  <p className="text-sm text-retro-green font-mono mb-3">&gt; {savings}</p>
                )}

                <div className="flex items-center gap-3">
                  <CheckInButton
                    ruleId={rule.id}
                    checkedToday={checkedToday ?? null}
                  />
                  {isPro && (
                    <a
                      href={`/api/card/${rule.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted hover:text-amber underline"
                    >
                      DOWNLOAD CARD
                    </a>
                  )}
                </div>

                <p className="text-xs text-muted mt-2">
                  BEST: {rule.longest_streak} DAYS
                </p>
              </div>
            );
          })}
        </div>
      )}

      {!isPro && (rules?.length ?? 0) >= 1 && (
        <p className="text-xs text-muted text-center mt-6">
          FREE PLAN: 1 RULE MAX.{" "}
          <Link href="/pricing" className="text-amber hover:underline">UPGRADE</Link>
          {" "}FOR UNLIMITED RULES + CARDS.
        </p>
      )}
    </div>
  );
}
