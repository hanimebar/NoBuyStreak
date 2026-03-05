import Logo from "@/components/Logo";
import Link from "next/link";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-16">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-muted text-xs tracking-widest font-mono">&gt;</span>
        <h2 className="font-retro text-2xl text-amber">{title}</h2>
        <div className="flex-1 border-t border-border" />
      </div>
      {children}
    </div>
  );
}

function Swatch({ bg, label, hex }: { bg: string; label: string; hex: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-16 h-16 border border-border" style={{ background: bg }} />
      <p className="font-retro text-sm text-amber">{label}</p>
      <p className="font-mono text-xs text-muted">{hex}</p>
    </div>
  );
}

function DarkBox({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <div className="border border-border bg-card p-6 flex flex-col items-center gap-3">
      {children}
      {label && <p className="font-mono text-xs text-muted mt-2">{label}</p>}
    </div>
  );
}

export default function BrandPage() {
  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-12">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="text-xs text-muted hover:text-amber font-mono">&lt;&lt; HOME</Link>
          <div className="mt-6 border border-border bg-card p-6">
            <p className="font-mono text-xs text-muted tracking-widest mb-2">C:\NOBUY&gt; brand-kit.exe</p>
            <h1 className="font-retro text-5xl text-amber">BRAND KIT</h1>
            <p className="font-mono text-sm text-muted mt-2">
              No-BS branding. No bullshit either.
            </p>
          </div>
        </div>

        {/* The concept */}
        <Section title="THE CONCEPT">
          <div className="border border-border bg-card p-6 font-mono text-sm space-y-3">
            <p className="text-foreground">
              <span className="text-amber">No-BS</span> works on two levels:
            </p>
            <p className="text-muted pl-4">[1] <span className="text-foreground">No Buy Streak</span> — the actual product</p>
            <p className="text-muted pl-4">[2] <span className="text-foreground">No Bullshit</span> — the attitude</p>
            <p className="text-muted pt-2">
              The name is the pitch. No over-engineered wellness app. Just a streak counter
              that keeps you honest.
            </p>
          </div>
        </Section>

        {/* Logos */}
        <Section title="LOGO VARIANTS">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DarkBox label="variant=&quot;full&quot; size=&quot;md&quot;">
              <Logo variant="full" size="md" />
            </DarkBox>
            <DarkBox label="variant=&quot;horizontal&quot; size=&quot;md&quot;">
              <Logo variant="horizontal" size="md" />
            </DarkBox>
            <DarkBox label="variant=&quot;mark&quot; size=&quot;lg&quot;">
              <Logo variant="mark" size="lg" />
            </DarkBox>
            <DarkBox label="variant=&quot;wordmark&quot; size=&quot;lg&quot;">
              <Logo variant="wordmark" size="lg" />
            </DarkBox>
          </div>
        </Section>

        {/* Pixel icon */}
        <Section title="PIXEL ICON">
          <div className="grid grid-cols-4 gap-4">
            {(["xs", "sm", "md", "lg"] as const).map((s) => (
              <DarkBox key={s} label={`size=&quot;${s}&quot;`}>
                <Logo variant="pixel" size={s} />
              </DarkBox>
            ))}
          </div>
        </Section>

        {/* Size scale */}
        <Section title="SIZE SCALE">
          <div className="border border-border bg-card p-6 flex flex-wrap items-end gap-8">
            {(["xs", "sm", "md", "lg", "xl"] as const).map((s) => (
              <div key={s} className="flex flex-col items-center gap-3">
                <Logo variant="mark" size={s} />
                <p className="font-mono text-xs text-muted">{s}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Badges & buttons */}
        <Section title="BADGES + BUTTONS">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Pro badge */}
            <DarkBox label="Pro badge">
              <Logo variant="badge" size="sm" label="PRO" />
            </DarkBox>

            {/* No-BS badge */}
            <DarkBox label="Brand badge">
              <Logo variant="badge" size="sm" label="No-BS" />
            </DarkBox>

            {/* CTA button styles */}
            <DarkBox label="Primary CTA">
              <button className="border-2 border-amber text-amber font-retro text-2xl px-6 py-2 hover:bg-amber hover:text-background transition w-full">
                [START FREE]
              </button>
            </DarkBox>

            <DarkBox label="Secondary CTA">
              <button className="border border-border text-foreground font-retro text-2xl px-6 py-2 hover:border-amber hover:text-amber transition w-full">
                [LEARN MORE]
              </button>
            </DarkBox>

            <DarkBox label="Danger / Slipped">
              <button className="border border-retro-red text-retro-red font-retro text-2xl px-6 py-2 hover:bg-retro-red hover:text-background transition w-full">
                [I SLIPPED]
              </button>
            </DarkBox>

            <DarkBox label="Success / Held">
              <button className="border border-retro-green text-retro-green font-retro text-2xl px-6 py-2 hover:bg-retro-green hover:text-background transition w-full">
                [HELD TODAY]
              </button>
            </DarkBox>

            <DarkBox label="Pro upgrade pill">
              <span className="font-retro text-lg border border-amber text-amber px-4 py-1">
                ★ PRO
              </span>
            </DarkBox>

            <DarkBox label="Streak badge">
              <div className="font-retro text-center">
                <div className="text-6xl text-amber">47</div>
                <div className="text-lg text-muted tracking-widest">DAY STREAK</div>
                <div className="text-sm text-retro-green mt-1">&gt; NO-BS SINCE JAN 17</div>
              </div>
            </DarkBox>
          </div>
        </Section>

        {/* Color palette */}
        <Section title="COLOR PALETTE">
          <div className="border border-border bg-card p-6">
            <div className="flex flex-wrap gap-8">
              <Swatch bg="#0a0a0a"  label="BACKGROUND" hex="#0a0a0a" />
              <Swatch bg="#111111"  label="CARD"       hex="#111111" />
              <Swatch bg="#2a2a2a"  label="BORDER"     hex="#2a2a2a" />
              <Swatch bg="#555544"  label="MUTED"      hex="#555544" />
              <Swatch bg="#c8c8b4"  label="FOREGROUND" hex="#c8c8b4" />
              <Swatch bg="#f0c040"  label="AMBER"      hex="#f0c040" />
              <Swatch bg="#39d353"  label="GREEN"      hex="#39d353" />
              <Swatch bg="#ff5f57"  label="RED"        hex="#ff5f57" />
            </div>
          </div>
        </Section>

        {/* Typography */}
        <Section title="TYPOGRAPHY">
          <div className="border border-border bg-card p-6 space-y-4">
            <div>
              <p className="font-mono text-xs text-muted mb-1">Display — VT323</p>
              <p className="font-retro text-5xl text-amber">No Buy Streak</p>
            </div>
            <div className="border-t border-border pt-4">
              <p className="font-mono text-xs text-muted mb-1">Body — IBM Plex Mono</p>
              <p className="font-mono text-base text-foreground">
                The quick brown fox jumps over the lazy dog.
              </p>
            </div>
            <div className="border-t border-border pt-4">
              <p className="font-mono text-xs text-muted mb-1">Prompt style</p>
              <p className="font-mono text-sm text-muted">&gt; C:\NOBUY&gt; streak.exe</p>
              <p className="font-mono text-sm text-foreground">&gt; STREAK LOADED. 47 DAYS.</p>
              <p className="font-mono text-sm text-retro-green">&gt; STATUS: HELD_</p>
            </div>
          </div>
        </Section>

        {/* Playful icons */}
        <Section title="ICON SET">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: "🔥", label: "ON FIRE", sub: "7+ day streak" },
              { icon: "💀", label: "SLIPPED", sub: "streak broken" },
              { icon: "🏆", label: "LEGEND", sub: "100+ days" },
              { icon: "👾", label: "PLAYER", sub: "on the board" },
              { icon: "📼", label: "LOGGED", sub: "temptation saved" },
              { icon: "💾", label: "SAVED", sub: "money not spent" },
              { icon: "⚡", label: "STREAK", sub: "active" },
              { icon: "🎮", label: "HIGH SCORE", sub: "personal best" },
            ].map((item) => (
              <div key={item.label} className="border border-border bg-card p-4 text-center hover:border-amber transition">
                <div className="text-3xl mb-2">{item.icon}</div>
                <p className="font-retro text-sm text-amber">{item.label}</p>
                <p className="font-mono text-xs text-muted mt-0.5">{item.sub}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Usage note */}
        <div className="border border-border bg-card p-6 font-mono text-xs text-muted space-y-1">
          <p>&gt; LOGO USAGE NOTES:</p>
          <p className="pl-4">— Always use on dark backgrounds (#0a0a0a or near-black)</p>
          <p className="pl-4">— Minimum clear space: 1× mark height on all sides</p>
          <p className="pl-4">— Do not recolor amber to any other hue</p>
          <p className="pl-4">— "No-BS" may be used alone; always reads as both meanings</p>
          <p className="pl-4">— Contact: reachout@actvli.com</p>
        </div>

      </div>
    </div>
  );
}
