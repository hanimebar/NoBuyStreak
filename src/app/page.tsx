import Link from "next/link";
import Leaderboard from "@/components/Leaderboard";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border">
        <span className="font-retro text-2xl text-amber tracking-wider">NOBUY STREAK</span>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm text-muted hover:text-foreground transition">
            PRICING
          </Link>
          <Link
            href="/login"
            className="text-sm border border-amber text-amber px-3 py-1.5 hover:bg-amber hover:text-background transition"
          >
            SIGN IN
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-2xl mx-auto px-6 pt-20 pb-16 text-center">
        <p className="text-muted text-xs tracking-widest mb-4">C:\NOBUY&gt; run streak.exe</p>
        <h1 className="font-retro text-5xl sm:text-6xl text-amber leading-tight mb-6">
          TURN SPENDING RESTRAINT INTO A STREAK
        </h1>
        <p className="text-foreground mb-8 leading-relaxed">
          Set No Buy rules, check in daily, watch your streak grow.
          Track money saved and share your progress.
        </p>
        <Link
          href="/login"
          className="inline-block border-2 border-amber text-amber font-retro text-2xl px-8 py-3 hover:bg-amber hover:text-background transition"
        >
          START FREE [ENTER]
        </Link>
        <p className="text-muted text-xs mt-3">
          Free plan: 1 rule. Pro: unlimited rules + shareable cards.
        </p>
      </section>

      {/* Features */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              key: "F1",
              title: "DAILY CHECK-INS",
              desc: "One tap — held or slipped. Streak updates instantly.",
            },
            {
              key: "F2",
              title: "TEMPTATION LOG",
              desc: "Log what tempted you. Revisit it 30 days later.",
            },
            {
              key: "F3",
              title: "SHAREABLE CARDS",
              desc: "Download a PNG showing your streak + money saved.",
            },
          ].map((f) => (
            <div key={f.key} className="border border-border bg-card p-5">
              <p className="text-muted text-xs mb-1">[{f.key}]</p>
              <h3 className="font-retro text-xl text-amber mb-2">{f.title}</h3>
              <p className="text-sm text-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Leaderboard />

      {/* Pricing teaser */}
      <section className="border-t border-border py-16 px-6 text-center">
        <h2 className="font-retro text-4xl text-amber mb-2">SIMPLE PRICING</h2>
        <p className="text-muted mb-8">Free to start. Pro unlocks everything.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-sm mx-auto">
          <div className="flex-1 border border-border bg-card p-5 text-left">
            <p className="font-retro text-xl text-foreground">FREE</p>
            <p className="font-retro text-4xl text-amber my-2">€0</p>
            <ul className="text-sm text-muted space-y-1 mt-3">
              <li>&gt; 1 rule</li>
              <li>&gt; Streak tracking</li>
              <li>&gt; Temptation log</li>
            </ul>
          </div>
          <div className="flex-1 border-2 border-amber bg-card p-5 text-left">
            <p className="font-retro text-xl text-amber">PRO</p>
            <p className="font-retro text-4xl text-amber my-2">€3<span className="text-lg text-muted">/mo</span></p>
            <ul className="text-sm text-foreground space-y-1 mt-3">
              <li>&gt; Unlimited rules</li>
              <li>&gt; Shareable PNG cards</li>
              <li>&gt; 30-day lookback emails</li>
            </ul>
          </div>
        </div>
        <Link href="/pricing" className="inline-block mt-6 text-sm text-amber hover:underline">
          SEE FULL PRICING &gt;&gt;
        </Link>
      </section>

      <footer className="text-center py-8 text-xs text-muted border-t border-border">
        <div className="flex gap-4 justify-center mb-2">
          <Link href="/privacy" className="hover:text-foreground">PRIVACY</Link>
          <Link href="/terms" className="hover:text-foreground">TERMS</Link>
        </div>
        © {new Date().getFullYear()} NOBUY STREAK · reachout@actvli.com
      </footer>
    </div>
  );
}
