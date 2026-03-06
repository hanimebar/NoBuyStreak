export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { rule_name } = await request.json();

  try {
    await sendWelcomeEmail(user.email!, rule_name ?? "your rule");
  } catch {
    // Don't fail the request if email fails
  }

  return NextResponse.json({ ok: true });
}
