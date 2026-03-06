import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — NoBuy Streak",
  description: "How NoBuy Streak collects, uses, and protects your personal data. GDPR-compliant.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <nav className="border-b border-border px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-mono text-xs text-muted hover:text-amber transition">
          ← HOME
        </Link>
        <p className="font-mono text-xs text-muted tracking-widest hidden sm:block">
          C:\NOBUY&gt; privacy.exe
        </p>
        <Link href="/login" className="font-mono text-xs border border-amber text-amber px-3 py-1 hover:bg-amber hover:text-background transition">
          SIGN IN
        </Link>
      </nav>

      <main className="flex-1 max-w-2xl mx-auto px-6 py-12 font-mono text-sm text-foreground">
        <div className="border border-border bg-card p-6 mb-6">
          <p className="text-muted text-xs tracking-widest mb-2">[SYSTEM FILE]</p>
          <h1 className="font-retro text-4xl text-amber">PRIVACY POLICY</h1>
          <p className="text-muted text-xs mt-2">Last updated: March 2026</p>
        </div>

        <div className="space-y-8">

          <section>
            <h2 className="font-retro text-xl text-amber mb-3">&gt; DATA CONTROLLER</h2>
            <p className="text-muted leading-relaxed">
              The data controller for NoBuy Streak is <strong className="text-foreground">Äctvli Responsible Consulting</strong>.
              Contact us at any time: <a href="mailto:reachout@actvli.com" className="text-amber hover:underline">reachout@actvli.com</a>
            </p>
          </section>

          <section>
            <h2 className="font-retro text-xl text-amber mb-3">&gt; WHAT WE COLLECT</h2>
            <div className="space-y-3 text-muted leading-relaxed">
              <p><span className="text-foreground">[ACCOUNT]</span> — Email address, authentication tokens (Google/GitHub OAuth if used), and your timezone.</p>
              <p><span className="text-foreground">[APP DATA]</span> — No Buy rules you create, daily check-in records (held/slipped), and temptation log entries.</p>
              <p><span className="text-foreground">[PAYMENT]</span> — If you upgrade to Pro, Stripe processes your payment. We store your Stripe Customer ID and subscription ID only. We never see or store your card details.</p>
              <p><span className="text-foreground">[OPTIONAL]</span> — Display name and preferred currency, only if you set them in Settings.</p>
            </div>
          </section>

          <section>
            <h2 className="font-retro text-xl text-amber mb-3">&gt; LAWFUL BASIS</h2>
            <div className="space-y-2 text-muted leading-relaxed">
              <p><span className="text-foreground">CONTRACT</span> — We process your data to deliver the service you signed up for (streaks, check-ins, lookback emails).</p>
              <p><span className="text-foreground">LEGITIMATE INTERESTS</span> — Account security, fraud prevention, and service stability.</p>
              <p><span className="text-foreground">CONSENT</span> — We send you optional reminder and lookback emails. You can unsubscribe at any time.</p>
            </div>
          </section>

          <section>
            <h2 className="font-retro text-xl text-amber mb-3">&gt; HOW WE USE IT</h2>
            <div className="space-y-2 text-muted leading-relaxed">
              <p>&gt; Calculate and display your No Buy streaks correctly in your timezone.</p>
              <p>&gt; Send the 30-day temptation lookback email (Pro subscribers).</p>
              <p>&gt; Generate your shareable streak card (Pro subscribers).</p>
              <p>&gt; Process and manage your subscription via Stripe.</p>
              <p>&gt; Display your handle and streak on the public leaderboard (only if you set a public display name).</p>
            </div>
            <p className="text-muted mt-3">
              <strong className="text-foreground">WE DO NOT</strong> sell your data, use it for advertising, or share it with third parties except the sub-processors below.
            </p>
          </section>

          <section>
            <h2 className="font-retro text-xl text-amber mb-3">&gt; SUB-PROCESSORS</h2>
            <div className="space-y-2 text-muted leading-relaxed">
              <p><span className="text-foreground">SUPABASE</span> — Database and authentication. Data stored in EU region (Frankfurt). <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-amber hover:underline">Privacy policy →</a></p>
              <p><span className="text-foreground">STRIPE</span> — Payment processing. Subject to Stripe&apos;s own privacy policy and PCI-DSS compliance. <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-amber hover:underline">Privacy policy →</a></p>
              <p><span className="text-foreground">RESEND</span> — Transactional email delivery. <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-amber hover:underline">Privacy policy →</a></p>
              <p><span className="text-foreground">VERCEL</span> — Hosting and edge network. <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-amber hover:underline">Privacy policy →</a></p>
            </div>
          </section>

          <section>
            <h2 className="font-retro text-xl text-amber mb-3">&gt; INTERNATIONAL TRANSFERS</h2>
            <p className="text-muted leading-relaxed">
              Some sub-processors (Stripe, Resend, Vercel) operate in the United States. Transfers are protected by Standard Contractual Clauses (SCCs) approved by the European Commission, or by adequacy decisions where applicable.
            </p>
          </section>

          <section>
            <h2 className="font-retro text-xl text-amber mb-3">&gt; COOKIES</h2>
            <p className="text-muted leading-relaxed">
              We use <strong className="text-foreground">session cookies only</strong> — set by Supabase Auth to keep you logged in. We do not use tracking cookies, analytics cookies, advertising cookies, or third-party pixel trackers.
            </p>
          </section>

          <section>
            <h2 className="font-retro text-xl text-amber mb-3">&gt; DATA RETENTION</h2>
            <div className="space-y-2 text-muted leading-relaxed">
              <p>&gt; Account data is retained until you delete your account.</p>
              <p>&gt; Check-in and temptation log data: retained while your account is active.</p>
              <p>&gt; Stripe billing data: retained as required by financial regulations (typically 7 years).</p>
              <p>&gt; On account deletion, all your personal data is permanently and irreversibly erased from our systems.</p>
            </div>
          </section>

          <section>
            <h2 className="font-retro text-xl text-amber mb-3">&gt; YOUR RIGHTS (GDPR)</h2>
            <div className="space-y-2 text-muted leading-relaxed">
              <p><span className="text-foreground">ACCESS</span> — Request a copy of all data we hold about you.</p>
              <p><span className="text-foreground">RECTIFICATION</span> — Correct inaccurate personal data.</p>
              <p><span className="text-foreground">ERASURE</span> — &quot;Right to be forgotten&quot; — delete your account and all data from Settings.</p>
              <p><span className="text-foreground">PORTABILITY</span> — Request your data in a machine-readable format.</p>
              <p><span className="text-foreground">RESTRICTION</span> — Request we limit processing of your data.</p>
              <p><span className="text-foreground">OBJECTION</span> — Object to processing based on legitimate interests.</p>
              <p><span className="text-foreground">WITHDRAW CONSENT</span> — Unsubscribe from emails at any time.</p>
            </div>
            <p className="text-muted mt-3">
              To exercise any of these rights, email <a href="mailto:reachout@actvli.com" className="text-amber hover:underline">reachout@actvli.com</a>. We will respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className="font-retro text-xl text-amber mb-3">&gt; AUTOMATED DECISIONS</h2>
            <p className="text-muted leading-relaxed">
              We do not make any automated decisions that produce legal or similarly significant effects about you.
            </p>
          </section>

          <section>
            <h2 className="font-retro text-xl text-amber mb-3">&gt; SUPERVISORY AUTHORITY</h2>
            <p className="text-muted leading-relaxed">
              If you believe we are processing your data unlawfully, you have the right to lodge a complaint with your national data protection authority. In the EU, you can find your local DPA at{" "}
              <a href="https://edpb.europa.eu/about-edpb/about-edpb/members_en" target="_blank" rel="noopener noreferrer" className="text-amber hover:underline">edpb.europa.eu</a>.
            </p>
          </section>

          <section>
            <h2 className="font-retro text-xl text-amber mb-3">&gt; CONTACT</h2>
            <p className="text-muted">
              <a href="mailto:reachout@actvli.com" className="text-amber hover:underline">reachout@actvli.com</a>
              {" "}· Äctvli Responsible Consulting
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
