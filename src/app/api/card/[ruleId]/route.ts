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

  // Load VT323 font for retro card aesthetic
  let fontData: Buffer;
  try {
    fontData = readFileSync(
      path.join(process.cwd(), "public", "fonts", "VT323-Regular.ttf")
    );
  } catch {
    fontData = Buffer.alloc(0);
  }

  const savings = moneySaved(rule);

  // Retro IBM terminal card: black bg, amber text, monospace
  const card = React.createElement(
    "div",
    {
      style: {
        width: 600,
        height: 314,
        background: "#0a0a0a",
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "flex-start",
        justifyContent: "center",
        fontFamily: "VT323, monospace",
        color: "#c8c8b4",
        padding: "40px 48px",
        border: "2px solid #2a2a2a",
      },
    },
    React.createElement("div", {
      style: { fontSize: 13, color: "#555544", letterSpacing: 3, marginBottom: 16 },
    }, "C:\\NOBUY> streak.exe"),
    React.createElement("div", {
      style: { fontSize: 22, color: "#c8c8b4", marginBottom: 4 },
    }, rule.name.toUpperCase()),
    React.createElement("div", {
      style: { fontSize: 110, color: "#f0c040", lineHeight: 1, marginBottom: 0 },
    }, String(rule.current_streak)),
    React.createElement("div", {
      style: { fontSize: 28, color: "#c8c8b4", marginTop: 4 },
    }, "DAYS STRONG"),
    ...(savings
      ? [React.createElement("div", {
          style: { fontSize: 20, color: "#39d353", marginTop: 12 },
        }, `> ${savings.toUpperCase()}`)]
      : []),
    React.createElement("div", {
      style: { fontSize: 14, color: "#555544", marginTop: 20 },
    }, "NOBUYSTREAK.ACTVLI.COM"),
  );

  const svg = await satori(
    card,
    {
      width: 600,
      height: 314,
      fonts: fontData.length
        ? [{ name: "VT323", data: fontData, weight: 400, style: "normal" }]
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
