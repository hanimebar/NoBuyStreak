export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { calculateStreaks, getTodayInTimezone } from "@/lib/streak";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { rule_id, held } = await request.json();
  if (!rule_id || typeof held !== "boolean") {
    return NextResponse.json({ error: "Missing rule_id or held" }, { status: 400 });
  }

  const service = createServiceClient();

  // Fetch user profile for timezone
  const { data: profile } = await service
    .from("profiles")
    .select("timezone")
    .eq("id", user.id)
    .single();

  const timezone = profile?.timezone ?? "UTC";
  const checked_date = getTodayInTimezone(timezone);

  // Upsert check-in (idempotent — one per rule per date)
  const { error: upsertError } = await service
    .from("checkins")
    .upsert(
      { rule_id, user_id: user.id, checked_date, held },
      { onConflict: "rule_id,checked_date" }
    );

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 });
  }

  // Recalculate streaks
  const { data: allCheckins } = await service
    .from("checkins")
    .select("checked_date, held")
    .eq("rule_id", rule_id);

  const { current_streak, longest_streak } = calculateStreaks(
    allCheckins ?? [],
    timezone
  );

  const { error: updateError } = await service
    .from("rules")
    .update({
      current_streak,
      longest_streak,
      last_checkin_at: new Date().toISOString(),
    })
    .eq("id", rule_id)
    .eq("user_id", user.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ current_streak, longest_streak, checked_date });
}
