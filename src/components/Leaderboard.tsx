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

  const maxStreak = entries.length > 0 ? entries[0].streak : 1;
  const totalDays = entries.reduce((s, e) => s + e.streak, 0);
  const avgStreak = entries.length > 0 ? Math.round(totalDays / entries.length) : 0;

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
        {!loading && entries.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-8">
            <StatBox label="TOP STREAK" value={`${entries[0].streak}d`} />
            <StatBox label="PLAYERS" value={String(entries.length)} />
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

          <div className="p-5 font-mono text-sm min-h-[280px]">
            {loading ? (
              <div className="text-[#555544]">
                &gt; SCANNING DATABASE
                {tick % 2 === 0 ? "█" : " "}
              </div>
            ) : entries.length === 0 ? (
              <div className="space-y-2 text-[#555544]">
                <p>&gt; NO ENTRIES FOUND.</p>
                <p>&gt; BE THE FIRST TO SET A STREAK.</p>
                <p>
                  &gt; <a href="/login" className="text-[#f0c040] hover:underline">START NOW</a>
                  {tick % 2 === 0 ? "█" : " "}
                </p>
              </div>
            ) : (
              <div>
                {/* Column headers */}
                <div className="flex items-center gap-3 text-[10px] text-[#555544] tracking-widest pb-2 mb-1 border-b border-[#1a1a1a]">
                  <span className="w-6 text-right">RNK</span>
                  <span className="w-16">HANDLE</span>
                  <span className="flex-1">RULE</span>
                  <span className="w-24 hidden sm:block">PROGRESS</span>
                  <span className="w-16 text-right">STREAK</span>
                </div>

                {/* Entries */}
                <div className="space-y-0">
                  {entries.map((e) => {
                    const rankColor = RANK_COLORS[e.rank - 1] ?? "#c8c8b4";
                    const glyph = CATEGORY_GLYPHS[e.category] ?? "▪";
                    return (
                      <div
                        key={e.rank}
                        className="flex items-center gap-3 py-2 border-b border-[#111] hover:bg-[#0f0f0f] transition-colors"
                      >
                        {/* Rank */}
                        <span
                          className="w-6 text-right font-retro text-lg shrink-0"
                          style={{ color: rankColor }}
                        >
                          {e.rank}
                        </span>

                        {/* Handle */}
                        <span className="w-16 text-[#c8c8b4] text-xs shrink-0">
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

                        {/* Streak */}
                        <span
                          className="w-16 text-right font-retro text-lg shrink-0"
                          style={{ color: rankColor }}
                        >
                          {e.streak}d
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Footer prompt */}
                <div className="mt-3 text-[#555544] text-xs">
                  &gt; SHOWING TOP {entries.length} ACTIVE STREAKS
                  {tick % 2 === 0 ? "█" : " "}
                </div>
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
