export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync } from "fs";
import path from "path";
import React from "react";

function moneySaved(rule: {
  current_streak: number;
  daily_spend_estimate: number | null;
}): string {
  if (!rule.daily_spend_estimate) return "";
  const total = rule.current_streak * rule.daily_spend_estimate;
  return `€${total.toFixed(0)} saved`;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ ruleId: string }> }
) {
  const { ruleId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const service = createServiceClient();

  const { data: profile } = await service
    .from("profiles")
    .select("is_pro")
    .eq("id", user.id)
    .single();

  if (!profile?.is_pro) {
    return NextResponse.json(
      { error: "Pro plan required for card generation" },
      { status: 403 }
    );
  }

  const { data: rule } = await service
    .from("rules")
    .select("name, current_streak, daily_spend_estimate")
    .eq("id", ruleId)
    .eq("user_id", user.id)
    .single();

  if (!rule) {
    return NextResponse.json({ error: "Rule not found" }, { status: 404 });
  }

  // Load a font — fallback to system if not present
  let fontData: Buffer;
  try {
    fontData = readFileSync(
      path.join(process.cwd(), "public", "fonts", "Inter-Bold.ttf")
    );
  } catch {
    // If font not found, satori will use its built-in fallback
    fontData = Buffer.alloc(0);
  }

  const savings = moneySaved(rule);

  const card = React.createElement(
    "div",
    {
      style: {
        width: 600,
        height: 314,
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter",
        color: "#ffffff",
        borderRadius: 16,
        padding: 32,
      },
    },
    React.createElement("div", { style: { fontSize: 14, opacity: 0.7, marginBottom: 8, letterSpacing: 2 } }, "NO BUY STREAK"),
    React.createElement("div", { style: { fontSize: 18, fontWeight: "bold", marginBottom: 16, opacity: 0.9 } }, rule.name),
    React.createElement("div", { style: { fontSize: 96, fontWeight: "bold", lineHeight: 1 } }, String(rule.current_streak)),
    React.createElement("div", { style: { fontSize: 20, opacity: 0.8, marginTop: 8 } }, "days strong"),
    ...(savings
      ? [React.createElement("div", {
          style: { fontSize: 16, marginTop: 16, background: "rgba(255,255,255,0.1)", padding: "6px 16px", borderRadius: 20 },
        }, savings)]
      : []),
    React.createElement("div", { style: { fontSize: 12, opacity: 0.5, marginTop: 24 } }, "nobuystreak.com"),
  );

  const svg = await satori(
    card,
    {
      width: 600,
      height: 314,
      fonts: fontData.length
        ? [{ name: "Inter", data: fontData, weight: 700, style: "normal" }]
        : [],
    }
  );

  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: 600 } });
  const png = resvg.render().asPng();
  const pngBuffer = Buffer.from(png);

  return new NextResponse(pngBuffer.buffer as ArrayBuffer, {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="nobuy-streak-${rule.current_streak}days.png"`,
      "Cache-Control": "no-store",
    },
  });
}
