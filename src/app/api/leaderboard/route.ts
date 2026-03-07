export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

function anonymize(email: string): string {
  const local = email.split("@")[0];
  if (local.length <= 2) return local[0] + "***";
  return local.slice(0, 3) + "***";
}

function handle(displayName: string | null, email: string): string {
  if (displayName && displayName.trim().length > 0) return displayName.trim();
  return anonymize(email);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get("limit");
  const all = limitParam === "all";
  const limit = all ? 1000 : 20;

  const service = createServiceClient();

  const { data, error } = await service
    .from("rules")
    .select("name, current_streak, longest_streak, category, daily_spend_estimate, profiles(email, display_name)")
    .eq("is_active", true)
    .gt("current_streak", 0)
    .order("current_streak", { ascending: false })
    .limit(limit);

  if (error) {
    return NextResponse.json({ entries: [] });
  }

  // Assign dense ranks — tied streaks share the same rank
  let currentRank = 1;
  const entries = (data ?? []).map((row, i) => {
    const prev = data[i - 1];
    if (i > 0 && row.current_streak < prev.current_streak) {
      currentRank = i + 1;
    }
    const prof = row.profiles as unknown as { email: string; display_name: string | null } | null;
    const savingsDays =
      row.daily_spend_estimate && row.daily_spend_estimate > 0
        ? Math.round(row.current_streak * row.daily_spend_estimate)
        : null;
    return {
      rank: currentRank,
      handle: handle(prof?.display_name ?? null, prof?.email ?? "???"),
      rule: row.name,
      category: row.category,
      streak: row.current_streak,
      longest: row.longest_streak,
      savingsDays,
    };
  });

  const cacheHeader = all
    ? "public, s-maxage=30, stale-while-revalidate=60"
    : "public, s-maxage=30, stale-while-revalidate=60";

  return NextResponse.json({ entries }, {
    headers: { "Cache-Control": cacheHeader },
  });
}
