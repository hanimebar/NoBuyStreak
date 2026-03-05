"use client";

import { useEffect, useState } from "react";

interface Entry {
  rank: number;
  handle: string;
  rule: string;
  category: string;
  streak: number;
  longest: number;
}

const CATEGORY_GLYPHS: Record<string, string> = {
  clothing: "👗",
  food: "🍔",
  tech: "💻",
  beauty: "💄",
  homewares: "🏠",
  other: "📦",
};

const RANK_COLORS = ["#f0c040", "#c0c0c0", "#cd7f32"];

const DEMO_ENTRIES: Entry[] = [
  { rank: 1, handle: "AAA", rule: "No new clothes", category: "clothing", streak: 365, longest: 365 },
  { rank: 2, handle: "SAR", rule: "No takeaway coffee", category: "food", streak: 312, longest: 312 },
  { rank: 3, handle: "CPU", rule: "No tech purchases", category: "tech", streak: 256, longest: 256 },
  { rank: 4, handle: "MIR", rule: "No beauty hauls", category: "beauty", streak: 199, longest: 210 },
  { rank: 5, handle: "ZAP", rule: "No fast fashion", category: "clothing", streak: 144, longest: 144 },
  { rank: 6, handle: "ACE", rule: "No homewares", category: "homewares", streak: 88, longest: 120 },
  { rank: 7, handle: "QQQ", rule: "No impulse buys", category: "other", streak: 42, longest: 77 },
];

function AsciiBar({ value, max }: { value: number; max: number }) {
  const filled = Math.round((value / max) * 20);
  const empty = 20 - filled;
  return (
    <span className="font-mono text-xs">
      <span style={{ color: "#f0c040" }}>{"█".repeat(filled)}</span>
      <span style={{ color: "#2a2a2a" }}>{"█".repeat(empty)}</span>
    </span>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[#2a2a2a] bg-[#0d0d0d] px-4 py-3 text-center">
      <div className="font-retro text-3xl text-[#f0c040]">{value}</div>
      <div className="text-[10px] text-[#555544] tracking-widest mt-1">{label}</div>
    </div>
  );
}

export default function Leaderboard() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((d) => {
        setEntries(d.entries ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Blinking cursor tick
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 600);
    return () => clearInterval(id);
  }, []);

  const isDemo = !loading && entries.length === 0;
  const display = isDemo ? DEMO_ENTRIES : entries;
  const maxStreak = display.length > 0 ? display[0].streak : 1;
  const totalDays = display.reduce((s, e) => s + e.streak, 0);
  const avgStreak = display.length > 0 ? Math.round(totalDays / display.length) : 0;

  return (
    <section className="border-t border-[#1a1a1a] py-20 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-[#555544] text-xs tracking-[0.3em] mb-3">
            C:\NOBUY&gt; leaderboard.exe
          </p>
          <h2 className="font-retro text-5xl text-[#f0c040]">HIGH SCORES</h2>
          <p className="text-[#555544] text-sm mt-2">
            REAL STREAKS FROM REAL PEOPLE — UPDATED LIVE
          </p>
        </div>

        {/* Stats row */}
        {!loading && (
          <div className="grid grid-cols-3 gap-3 mb-8">
            <StatBox label="TOP STREAK" value={`${display[0]?.streak ?? 0}d`} />
            <StatBox label={isDemo ? "DEMO MODE" : "PLAYERS"} value={isDemo ? "---" : String(entries.length)} />
            <StatBox label="AVG STREAK" value={`${avgStreak}d`} />
          </div>
        )}

        {/* Terminal window */}
        <div className="border border-[#2a2a2a] bg-[#080808]">
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-2 bg-[#111] border-b border-[#2a2a2a]">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="font-mono text-xs text-[#555544] ml-2">
              NOBUYSTREAK — leaderboard.exe
            </span>
          </div>

          <div className="p-5 font-mono text-sm min-h-[320px]">
            {loading ? (
              <div className="text-[#555544]">
                &gt; SCANNING DATABASE
                {tick % 2 === 0 ? "█" : " "}
              </div>
            ) : (
              <div>
                {/* Arcade header */}
                {isDemo && (
                  <div className="text-center mb-4">
                    <p
                      className="font-retro text-2xl tracking-widest"
                      style={{ color: tick % 2 === 0 ? "#f0c040" : "#c8a000" }}
                    >
                      *** HIGH SCORES ***
                    </p>
                    <p className="text-[10px] text-[#555544] mt-1 tracking-widest">
                      — DEMO DATA — REAL SCORES APPEAR WHEN PLAYERS JOIN —
                    </p>
                  </div>
                )}

                {/* Column headers */}
                <div className="flex items-center gap-3 text-[10px] text-[#555544] tracking-widest pb-2 mb-1 border-b border-[#1a1a1a]">
                  <span className="w-6 text-right shrink-0">RNK</span>
                  <span className="w-10 shrink-0">NAME</span>
                  <span className="flex-1">RULE</span>
                  <span className="w-24 hidden sm:block shrink-0">PROGRESS</span>
                  <span className="w-16 text-right shrink-0">STREAK</span>
                </div>

                {/* Entries */}
                <div>
                  {display.map((e) => {
                    const rankColor = RANK_COLORS[e.rank - 1] ?? "#c8c8b4";
                    const glyph = CATEGORY_GLYPHS[e.category] ?? "▪";
                    const dimmed = isDemo ? "opacity-70" : "";
                    return (
                      <div
                        key={e.rank}
                        className={`flex items-center gap-3 py-2 border-b border-[#111] hover:bg-[#0f0f0f] transition-colors ${dimmed}`}
                      >
                        {/* Rank */}
                        <span
                          className="w-6 text-right font-retro text-xl shrink-0"
                          style={{ color: rankColor }}
                        >
                          {e.rank}
                        </span>

                        {/* Handle — 3-char arcade initials */}
                        <span
                          className="w-10 font-retro text-xl shrink-0 tracking-widest"
                          style={{ color: rankColor }}
                        >
                          {e.handle}
                        </span>

                        {/* Rule */}
                        <span className="flex-1 text-[#c8c8b4] text-xs truncate">
                          <span className="mr-1">{glyph}</span>
                          {e.rule}
                        </span>

                        {/* Progress bar */}
                        <span className="w-24 hidden sm:block shrink-0">
                          <AsciiBar value={e.streak} max={maxStreak} />
                        </span>

                        {/* Streak — right-aligned score style */}
                        <span
                          className="w-16 text-right font-retro text-xl shrink-0 tabular-nums"
                          style={{ color: rankColor }}
                        >
                          {String(e.streak).padStart(4, "\u00A0")}D
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Footer */}
                {isDemo ? (
                  <div className="mt-4 text-center">
                    <p
                      className="font-retro text-xl tracking-widest"
                      style={{ color: tick % 2 === 0 ? "#f0c040" : "transparent" }}
                    >
                      INSERT COIN TO CONTINUE
                    </p>
                    <p className="text-[10px] text-[#555544] mt-1">
                      (just kidding — it's free){" "}
                      <a href="/login" className="text-[#f0c040] hover:underline">START NOW</a>
                    </p>
                  </div>
                ) : (
                  <div className="mt-3 text-[#555544] text-xs">
                    &gt; SHOWING TOP {entries.length} ACTIVE STREAKS
                    {tick % 2 === 0 ? "█" : " "}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <p className="text-center text-xs text-[#555544] mt-6">
          WANT YOUR NAME HERE?{" "}
          <a href="/login" className="text-[#f0c040] hover:underline">
            START YOUR STREAK &gt;&gt;
          </a>
        </p>
      </div>
    </section>
  );
}
