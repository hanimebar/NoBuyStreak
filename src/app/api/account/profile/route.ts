export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function PUT(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { display_name, avatar_url, country, birth_year, lookback_emails, currency } = body;

  const update: Record<string, unknown> = {};
  if (display_name  !== undefined) update.display_name  = display_name || null;
  if (avatar_url    !== undefined) update.avatar_url    = avatar_url   || null;
  if (country       !== undefined) update.country       = country      || null;
  if (birth_year    !== undefined) update.birth_year    = birth_year   ? parseInt(birth_year) : null;
  if (lookback_emails !== undefined) update.lookback_emails = Boolean(lookback_emails);
  if (currency        !== undefined) update.currency        = currency;

  const service = createServiceClient();
  const { error } = await service.from("profiles").update(update).eq("id", user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
