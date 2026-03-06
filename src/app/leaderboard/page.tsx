"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";

interface Entry {
  rank: number;
  handle: string;
  rule: string;
  category: string;
  streak: number;
  longest: number;
  savingsDays: number | null;
}

const ALL_CATEGORIES = [
  "clothing", "food", "drinks", "tech", "beauty", "homewares",
  "gaming", "gambling", "alcohol", "smoking", "trading", "other",
];

const CATEGORY_GLYPHS: Record<string, string> = {
  clothing: "👗", food: "🍔", drinks: "🧃", tech: "💻",
  beauty: "💄", homewares: "🏠", gaming: "🎮", gambling: "🎲",
  alcohol: "🍺", smoking: "🚬", trading: "📈", other: "▪",
};

const RANK_COLORS = ["#f0c040", "#c0c0c0", "#cd7f32"];

type SortKey = "streak" | "longest" | "savings";

export default function LeaderboardPage() {
  const [all, setAll] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("");
  const [sort, setSort] = useState<SortKey>("streak");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    fetch("/api/leaderboard?limit=all")
      .then((r) => r.json())
      .then((d) => { setAll(d.entries ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 600);
    return () => clearInterval(id);
  }, []);

  const filtered = useMemo(() => {
    let entries = [...all];
    if (category) entries = entries.filter((e) => e.category === category);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      entries = entries.filter(
        (e) => e.handle.toLowerCase().includes(q) || e.rule.toLowerCase().includes(q)
      );
    }
    if (sort === "longest") entries.sort((a, b) => b.longest - a.longest);
    else if (sort === "savings") entries.sort((a, b) => (b.savingsDays ?? 0) - (a.savingsDays ?? 0));
    else entries.sort((a, b) => b.streak - a.streak);
    // Re-rank after filter/sort
    let currentRank = 1;
    return entries.map((e, i) => {
      if (i > 0) {
        const val = sort === "longest" ? e.longest : sort === "savings" ? (e.savingsDays ?? 0) : e.streak;
        const prevVal = sort === "longest" ? entries[i-1].longest : sort === "savings" ? (entries[i-1].savingsDays ?? 0) : entries[i-1].streak;
        if (val < prevVal) currentRank = i + 1;
      }
      return { ...e, rank: currentRank };
    });
  }, [all, category, search, sort]);

  function downloadCSV() {
    const header = "rank,handle,rule,category,streak,longest,estimated_savings_days\n";
    const rows = filtered.map((e) =>
      `${e.rank},"${e.handle}","${e.rule}",${e.category},${e.streak},${e.longest},${e.savingsDays ?? ""}`
    ).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nobuystreak-leaderboard.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border">
        <Link href="/" className="font-mono text-xs text-muted hover:text-amber transition">
          ← BACK
        </Link>
        <p className="font-mono text-xs text-muted tracking-widest">C:\NOBUY&gt; leaderboard.exe</p>
        <Link href="/login" className="font-mono text-xs border border-amber text-amber px-3 py-1 hover:bg-amber hover:text-background transition">
          SIGN IN
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8 pb-16">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-retro text-5xl sm:text-6xl text-amber">HIGH SCORES</h1>
          <p className="font-mono text-xs text-muted mt-2 tracking-widest">
            REAL STREAKS FROM REAL PEOPLE
          </p>
        </div>

        {/* Stats */}
        {!loading && all.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { label: "PLAYERS", value: String(all.length) },
              { label: "TOP STREAK", value: `${all[0]?.streak ?? 0}D` },
              { label: "AVG STREAK", value: `${Math.round(all.reduce((s, e) => s + e.streak, 0) / all.length)}D` },
            ].map((s) => (
              <div key={s.label} className="border border-border bg-card px-4 py-3 text-center">
                <div className="font-retro text-3xl text-amber">{s.value}</div>
                <div className="font-mono text-[10px] text-muted tracking-widest mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <input
            type="text"
            placeholder="> SEARCH BY NAME OR RULE..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-card border border-border text-foreground placeholder-muted px-3 py-2 font-mono text-sm focus:outline-none focus:border-amber"
          />
          {/* Sort */}
          <div className="flex gap-1">
            {([
              { key: "streak", label: "STREAK" },
              { key: "longest", label: "BEST" },
              { key: "savings", label: "SAVINGS" },
            ] as { key: SortKey; label: string }[]).map((s) => (
              <button
                key={s.key}
                onClick={() => setSort(s.key)}
                className={`font-mono text-xs px-3 py-2 border transition ${
                  sort === s.key
                    ? "border-amber text-amber"
                    : "border-border text-muted hover:border-amber hover:text-amber"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          {/* Download */}
          <button
            onClick={downloadCSV}
            className="font-mono text-xs border border-border text-muted px-3 py-2 hover:border-amber hover:text-amber transition"
          >
            ↓ CSV
          </button>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setCategory("")}
            className={`font-mono text-xs px-3 py-1 border transition ${
              !category ? "border-amber text-amber" : "border-border text-muted hover:border-amber hover:text-amber"
            }`}
          >
            ALL
          </button>
          {ALL_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(category === c ? "" : c)}
              className={`font-mono text-xs px-3 py-1 border transition ${
                category === c ? "border-amber text-amber" : "border-border text-muted hover:border-amber hover:text-amber"
              }`}
            >
              {CATEGORY_GLYPHS[c]} {c.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="border border-border bg-card">
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-2 bg-[#111] border-b border-border">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="font-mono text-xs text-muted ml-2">
              leaderboard.exe — {filtered.length} entries
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center font-mono text-sm text-muted">
              &gt; LOADING{tick % 2 === 0 ? "█" : " "}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center font-mono text-sm text-muted">
              &gt; NO RESULTS FOUND. TRY A DIFFERENT FILTER.
            </div>
          ) : (
            <div>
              {/* Column headers */}
              <div className="flex items-center gap-3 px-4 py-2 font-mono text-[10px] text-muted tracking-widest border-b border-border">
                <span className="w-8 text-right shrink-0">RNK</span>
                <span className="w-24 shrink-0">PLAYER</span>
                <span className="flex-1">RULE</span>
                <span className="w-20 shrink-0 hidden sm:block">CATEGORY</span>
                <span className="w-16 text-right shrink-0">
                  {sort === "longest" ? "BEST" : sort === "savings" ? "SAVED" : "STREAK"}
                </span>
              </div>

              {/* Rows */}
              {filtered.map((e, i) => {
                const rankColor = RANK_COLORS[e.rank - 1] ?? "#c8c8b4";
                const displayVal =
                  sort === "longest"
                    ? `${e.longest}D`
                    : sort === "savings"
                    ? e.savingsDays != null
                      ? `~${e.savingsDays}`
                      : "—"
                    : `${e.streak}D`;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-4 py-2.5 border-b border-[#111] hover:bg-[#0f0f0f] transition-colors"
                  >
                    <span className="w-8 text-right font-retro text-lg shrink-0" style={{ color: rankColor }}>
                      {e.rank}
                    </span>
                    <span className="w-24 font-mono text-sm shrink-0 truncate" style={{ color: rankColor }}>
                      {e.handle}
                    </span>
                    <span className="flex-1 font-mono text-xs text-foreground truncate">
                      <span className="mr-1">{CATEGORY_GLYPHS[e.category] ?? "▪"}</span>
                      {e.rule}
                    </span>
                    <span className="w-20 font-mono text-xs text-muted uppercase shrink-0 hidden sm:block truncate">
                      {e.category}
                    </span>
                    <span className="w-16 text-right font-retro text-lg shrink-0 tabular-nums" style={{ color: rankColor }}>
                      {displayVal}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-6">
          <p className="font-mono text-xs text-muted">
            {filtered.length} of {all.length} entries
          </p>
          <Link
            href="/login"
            className="font-mono text-xs text-amber hover:underline"
          >
            GET ON THE BOARD →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
