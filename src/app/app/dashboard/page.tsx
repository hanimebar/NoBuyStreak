export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import CheckInButton from "@/components/CheckInButton";
import type { Rule } from "@/types";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { upgraded?: string };
}) {
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

  // Get today's check-ins for all rules
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
      {searchParams.upgraded && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
          Welcome to Pro! You now have unlimited rules and shareable cards.
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Your rules</h1>
        {!isPro && (
          <Link
            href="/pricing"
            className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-full hover:bg-blue-700 transition"
          >
            Upgrade to Pro
          </Link>
        )}
      </div>

      {(!rules || rules.length === 0) ? (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">No rules yet.</p>
          <Link
            href="/onboarding"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
          >
            Create your first rule
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {rules.map((rule: Rule) => {
            const checkedToday = todayCheckins[rule.id];
            const savings =
              rule.daily_spend_estimate && rule.current_streak > 0
                ? `€${(rule.current_streak * rule.daily_spend_estimate).toFixed(0)} saved`
                : null;

            return (
              <div
                key={rule.id}
                className="bg-white rounded-xl border border-gray-200 p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <Link
                      href={`/app/rules/${rule.id}`}
                      className="font-semibold text-gray-900 hover:text-blue-600"
                    >
                      {rule.name}
                    </Link>
                    <p className="text-xs text-gray-400 capitalize mt-0.5">{rule.category}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">
                      {rule.current_streak}
                    </div>
                    <div className="text-xs text-gray-400">day streak</div>
                  </div>
                </div>

                {savings && (
                  <p className="text-sm text-green-600 font-medium mb-3">{savings}</p>
                )}

                <div className="flex items-center gap-2">
                  <CheckInButton
                    ruleId={rule.id}
                    checkedToday={checkedToday ?? null}
                  />
                  {isPro && (
                    <a
                      href={`/api/card/${rule.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-500 hover:text-gray-700 underline"
                    >
                      Download card
                    </a>
                  )}
                </div>

                <p className="text-xs text-gray-400 mt-2">
                  Best: {rule.longest_streak} days
                </p>
              </div>
            );
          })}
        </div>
      )}

      {!isPro && (rules?.length ?? 0) >= 1 && (
        <p className="text-xs text-gray-400 text-center mt-6">
          Free plan: 1 rule max.{" "}
          <Link href="/pricing" className="text-blue-500 hover:underline">
            Upgrade
          </Link>{" "}
          for unlimited rules + shareable cards.
        </p>
      )}
    </div>
  );
}
