export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

function getResend() {
  const { Resend } = require("resend");
  return new Resend(process.env.RESEND_API_KEY);
}

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const service = createServiceClient();
  const now = new Date();
  const daysAgo28 = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000).toISOString();
  const daysAgo35 = new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000).toISOString();

  const { data: temptations } = await service
    .from("temptation_logs")
    .select("*, profiles(email)")
    .gte("logged_at", daysAgo35)
    .lte("logged_at", daysAgo28)
    .eq("acknowledged", false);

  if (!temptations || temptations.length === 0) {
    return NextResponse.json({ sent: 0 });
  }

  // Group by user
  const byUser = new Map<string, typeof temptations>();
  for (const t of temptations) {
    const existing = byUser.get(t.user_id) ?? [];
    existing.push(t);
    byUser.set(t.user_id, existing);
  }

  const resend = getResend();
  let sent = 0;
  const ids: string[] = temptations.map((t) => t.id);

  for (const [userId, items] of byUser) {
    const email = (items[0] as { profiles: { email: string } }).profiles?.email;
    if (!email) continue;

    const listHtml = items
      .map(
        (t) =>
          `<li><strong>${t.item_name}</strong> — ${t.category}, ~€${t.estimated_cost ?? "?"} (${t.outcome})</li>`
      )
      .join("");

    await resend.emails.send({
      from: "NoBuy Streak <reachout@actvli.com>",
      to: email,
      subject: "Remember these temptations from 30 days ago?",
      html: `
        <h2>Your temptation log from ~30 days ago</h2>
        <p>Here's what you logged. How do you feel about them now?</p>
        <ul>${listHtml}</ul>
        <p>Keep going — every day counts. 💪</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/app/dashboard">View your dashboard</a></p>
      `,
    });
    sent++;
  }

  // Mark acknowledged
  await service
    .from("temptation_logs")
    .update({ acknowledged: true })
    .in("id", ids);

  return NextResponse.json({ sent });
}
