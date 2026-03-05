"use client";

import { useEffect, useState } from "react";

type Variant = "full" | "mark" | "horizontal" | "wordmark" | "badge" | "pixel";
type Size = "xs" | "sm" | "md" | "lg" | "xl";

interface SizeConfig { mark: number; text: number; sub: number; gap: number }

const sizes: Record<Size, SizeConfig> = {
  xs: { mark: 24, text: 14, sub: 9,  gap: 6  },
  sm: { mark: 32, text: 18, sub: 10, gap: 8  },
  md: { mark: 48, text: 24, sub: 12, gap: 10 },
  lg: { mark: 64, text: 32, sub: 14, gap: 12 },
  xl: { mark: 96, text: 48, sub: 18, gap: 16 },
};

/** Blinking block cursor */
function Cursor({ color = "#f0c040" }: { color?: string }) {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setOn((v) => !v), 550);
    return () => clearInterval(id);
  }, []);
  return (
    <span
      style={{
        display: "inline-block",
        width: "0.55em",
        height: "1em",
        background: on ? color : "transparent",
        verticalAlign: "text-bottom",
        marginLeft: 2,
      }}
    />
  );
}

/** The core NBS mark — a bordered terminal box */
function Mark({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" fill="#0a0a0a" />
      <rect x="2" y="2" width="60" height="60" fill="none" stroke="#f0c040" strokeWidth="3" />
      {/* corner ticks */}
      <line x1="2"  y1="14" x2="14" y2="14" stroke="#f0c040" strokeWidth="2" />
      <line x1="50" y1="14" x2="62" y2="14" stroke="#f0c040" strokeWidth="2" />
      <line x1="2"  y1="50" x2="14" y2="50" stroke="#f0c040" strokeWidth="2" />
      <line x1="50" y1="50" x2="62" y2="50" stroke="#f0c040" strokeWidth="2" />
      {/* NBS */}
      <text x="32" y="31" fontFamily="'Courier New', monospace" fontSize="20" fontWeight="bold"
            fill="#f0c040" textAnchor="middle" letterSpacing="3">NBS</text>
      {/* Streak bar */}
      <rect x="9"  y="37" width="13" height="5" fill="#f0c040" />
      <rect x="24" y="37" width="13" height="5" fill="#f0c040" />
      <rect x="39" y="37" width="10" height="5" fill="#39d353" />
      <rect x="51" y="37" width="4"  height="5" fill="#39d353" opacity="0.35" />
      {/* tagline */}
      <text x="32" y="54" fontFamily="'Courier New', monospace" fontSize="6.5"
            fill="#555544" textAnchor="middle" letterSpacing="1">NO BUY STREAK</text>
    </svg>
  );
}

/** Full stacked logo */
function Full({ s }: { s: SizeConfig }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: s.gap / 2 }}>
      <Mark size={s.mark} />
      <div style={{ fontFamily: "var(--font-retro, monospace)", fontSize: s.text, color: "#f0c040", letterSpacing: 4, lineHeight: 1 }}>
        [No-BS]<Cursor />
      </div>
      <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: s.sub, color: "#555544", letterSpacing: 3 }}>
        NO BUY STREAK
      </div>
    </div>
  );
}

/** Horizontal logo — mark + text beside it */
function Horizontal({ s }: { s: SizeConfig }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: s.gap }}>
      <Mark size={s.mark} />
      <div>
        <div style={{ fontFamily: "var(--font-retro, monospace)", fontSize: s.text, color: "#f0c040", letterSpacing: 3, lineHeight: 1 }}>
          [No-BS]<Cursor />
        </div>
        <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: s.sub, color: "#555544", letterSpacing: 2, marginTop: 4 }}>
          NO BUY STREAK
        </div>
      </div>
    </div>
  );
}

/** Text-only wordmark */
function Wordmark({ s }: { s: SizeConfig }) {
  return (
    <div style={{ fontFamily: "var(--font-retro, monospace)", fontSize: s.text, color: "#f0c040", letterSpacing: 4, lineHeight: 1 }}>
      No-BS<Cursor />
    </div>
  );
}

/** Inline badge — for buttons, tags, etc. */
function Badge({ s, label = "No-BS" }: { s: SizeConfig; label?: string }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      border: "2px solid #f0c040", padding: `${s.gap / 2}px ${s.gap}px`,
      background: "#0a0a0a",
      fontFamily: "var(--font-retro, monospace)", fontSize: s.text,
      color: "#f0c040", letterSpacing: 3, lineHeight: 1,
    }}>
      {label}<Cursor />
    </span>
  );
}

/** Pixel-art style icon — 8-bit "NBS" block */
function Pixel({ size = 48 }: { size?: number }) {
  const cell = size / 8;
  // 8x8 pixel grid — hand-drawn "N" pattern + streak dots
  const pixels: [number, number, string][] = [
    // N shape
    [0,0,"#f0c040"],[0,1,"#f0c040"],[0,2,"#f0c040"],[0,3,"#f0c040"],
    [1,1,"#f0c040"],
    [2,2,"#f0c040"],
    [3,0,"#f0c040"],[3,1,"#f0c040"],[3,2,"#f0c040"],[3,3,"#f0c040"],
    // streak bar row 5
    [0,5,"#f0c040"],[1,5,"#f0c040"],[2,5,"#39d353"],[3,5,"#39d353"],
    [4,5,"#39d353"],[5,5,"#39d353"],[6,5,"#f0c040"],[7,5,"#f0c040"],
    // BS dots row 0–3 right side
    [5,0,"#f0c040"],[6,0,"#f0c040"],
    [5,1,"#f0c040"],[6,1,"#f0c040"],[7,1,"#f0c040"],
    [5,2,"#f0c040"],[6,2,"#f0c040"],
    [5,3,"#f0c040"],[6,3,"#f0c040"],[7,3,"#f0c040"],
    // strike-through on BS
    [5,1,"#39d353"],[6,1,"#39d353"],[7,1,"#39d353"],
    // border dots
    [0,7,"#555544"],[7,7,"#555544"],
  ];
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="#0a0a0a" />
      {pixels.map(([x, y, color], i) => (
        <rect key={i} x={x * cell} y={y * cell} width={cell - 1} height={cell - 1} fill={color} />
      ))}
    </svg>
  );
}

export default function Logo({
  variant = "horizontal",
  size = "md",
  label,
}: {
  variant?: Variant;
  size?: Size;
  label?: string;
}) {
  const s = sizes[size];

  if (variant === "mark")     return <Mark size={s.mark} />;
  if (variant === "full")     return <Full s={s} />;
  if (variant === "horizontal") return <Horizontal s={s} />;
  if (variant === "wordmark") return <Wordmark s={s} />;
  if (variant === "badge")    return <Badge s={s} label={label} />;
  if (variant === "pixel")    return <Pixel size={s.mark} />;
  return <Horizontal s={s} />;
}
