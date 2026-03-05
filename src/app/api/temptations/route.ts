export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { rule_id, item_name, category, estimated_cost, trigger_source, outcome } = body;

  if (!rule_id || !item_name || !category || !outcome) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const service = createServiceClient();
  const { data, error } = await service
    .from("temptation_logs")
    .insert({
      rule_id,
      user_id: user.id,
      item_name,
      category,
      estimated_cost: estimated_cost ?? null,
      trigger_source: trigger_source ?? null,
      outcome,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
