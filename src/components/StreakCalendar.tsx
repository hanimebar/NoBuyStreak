"use client";

interface Checkin {
  checked_date: string; // YYYY-MM-DD
  held: boolean;
}

interface Props {
  checkins: Checkin[];
  timezone: string;
}

export default function StreakCalendar({ checkins, timezone }: Props) {
  const today = new Date().toLocaleDateString("en-CA", { timeZone: timezone });

  // Build a map of date → held status
  const map: Record<string, boolean> = {};
  for (const c of checkins) {
    map[c.checked_date] = c.held;
  }

  // Generate last 70 days (10 weeks × 7 days)
  const days: { date: string; label: string }[] = [];
  for (let i = 69; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const date = d.toLocaleDateString("en-CA", { timeZone: timezone });
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: timezone });
    days.push({ date, label });
  }

  const DOW = ["S", "M", "T", "W", "T", "F", "S"];

  // Pad start so first day aligns to its weekday
  const firstDow = new Date(days[0].date + "T12:00:00").getDay();
  const padded = [...Array(firstDow).fill(null), ...days];

  // Chunk into weeks
  const weeks: (typeof days[0] | null)[][] = [];
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7));
  }

  function cellColor(date: string | null): string {
    if (!date) return "transparent";
    if (date > today) return "#1a1a1a";
    const val = map[date];
    if (val === true)  return "#39d353";
    if (val === false) return "#ff5f57";
    return "#2a2a2a"; // no check-in
  }

  function cellTitle(entry: typeof days[0] | null): string {
    if (!entry) return "";
    const val = map[entry.date];
    if (val === true)  return `${entry.label} — HELD`;
    if (val === false) return `${entry.label} — SLIPPED`;
    return `${entry.label} — no check-in`;
  }

  return (
    <div>
      <p className="font-mono text-xs text-muted uppercase tracking-wider mb-3">Last 10 weeks</p>
      <div className="overflow-x-auto">
        <div style={{ display: "inline-block" }}>
          {/* Day-of-week header */}
          <div style={{ display: "flex", gap: 3, marginBottom: 3 }}>
            {DOW.map((d, i) => (
              <div
                key={i}
                style={{ width: 12, textAlign: "center", fontSize: 9, color: "#555544", flexShrink: 0 }}
              >
                {d}
              </div>
            ))}
          </div>
          {/* Weeks */}
          {weeks.map((week, wi) => (
            <div key={wi} style={{ display: "flex", gap: 3, marginBottom: 3 }}>
              {week.map((entry, di) => (
                <div
                  key={di}
                  title={cellTitle(entry)}
                  style={{
                    width: 12,
                    height: 12,
                    background: cellColor(entry?.date ?? null),
                    border: entry?.date === today ? "1px solid #f0c040" : "none",
                    flexShrink: 0,
                    cursor: entry ? "default" : "default",
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4 mt-3">
        <LegendItem color="#39d353" label="HELD" />
        <LegendItem color="#ff5f57" label="SLIPPED" />
        <LegendItem color="#2a2a2a" label="NO CHECK-IN" />
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div style={{ width: 10, height: 10, background: color, flexShrink: 0 }} />
      <span className="font-mono text-xs text-muted">{label}</span>
    </div>
  );
}
