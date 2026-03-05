export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

function anonymize(email: string): string {
  const local = email.split("@")[0];
  if (local.length <= 2) return local[0] + "***";
  return local.slice(0, 3) + "***";
}

export async function GET() {
  const service = createServiceClient();

  const { data, error } = await service
    .from("rules")
    .select("name, current_streak, longest_streak, category, profiles(email)")
    .eq("is_active", true)
    .gt("current_streak", 0)
    .order("current_streak", { ascending: false })
    .limit(10);

  if (error) {
    return NextResponse.json({ entries: [] });
  }

  const entries = (data ?? []).map((row, i) => ({
    rank: i + 1,
    handle: anonymize((row.profiles as unknown as { email: string })?.email ?? "???"),
    rule: row.name,
    category: row.category,
    streak: row.current_streak,
    longest: row.longest_streak,
  }));

  return NextResponse.json({ entries }, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
  });
}
