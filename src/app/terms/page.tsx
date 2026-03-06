import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service — NoBuy Streak",
  description: "Terms and conditions for using NoBuy Streak.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <nav className="border-b border-border px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-mono text-xs text-muted hover:text-amber transition">
          ← HOME
        </Link>
        <p className="font-mono text-xs text-muted tracking-widest hidden sm:block">
          C:\NOBUY&gt; terms.exe
        </p>
        <Link href="/login" className="font-mono text-xs border border-amber text-amber px-3 py-1 hover:bg-amber hover:text-background transition">
          SIGN IN
        </Link>
      </nav>

      <main className="flex-1 max-w-2xl mx-auto px-6 py-12 font-mono text-sm text-foreground">
        <div className="border border-border bg-card p-6 mb-6">
          <p className="text-muted text-xs tracking-widest mb-2">[LEGAL FILE]</p>
          <h1 className="font-retro text-4xl text-amber">TERMS OF SERVICE</h1>
          <p className="text-muted text-xs mt-2">Last updated: March 2026</p>
        </div>

        <div className="space-y-8">

          <section>
            <h2 className="font-retro text-xl text-amber mb-3">&gt; THE SERVICE</h2>
            <p className="text-muted leading-relaxed">
              NoBuy Streak (&quot;the Service&quot;) is operated by <strong className="text-foreground">Äctvli Responsible Consulting</strong>. By creating an account, you agree to these terms. If you do not agree, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="font-retro text-xl text-amber mb-3">&gt; ELIGIBILITY</h2>
            <p className="text-muted leading-relaxed">
              You must be at least 16 years old to use NoBuy Streak. By using the Service, you confirm you meet this requirement.
            </p>
          </section>

          <section>
            <h2 className="font-retro text-xl text-amber mb-3">&gt; YOUR ACCOUNT</h2>
            <div className="space-y-2 text-muted leading-relaxed">
              <p>&gt; You are responsible for keeping your login credentials secure.</p>
              <p>&gt; You are responsible for all activity that occurs under your account.</p>
              <p>&gt; Notify us immediately if you suspect unauthorised access: <a href="mailto:reachout@actvli.com" className="text-amber hover:underline">reachout@actvli.com</a></p>
              <p>&gt; We may suspend accounts that violate these terms, engage in abuse, or attempt to circumvent service limits.</p>
            </div>
          </section>

          <section>
            <h2 className="font-retro text-xl text-amber mb-3">&gt; ACCEPTABLE USE</h2>
            <div className="space-y-2 text-muted leading-relaxed">
              <p>You may use the Service for personal, non-commercial purposes only. You must not:</p>
              <p>&gt; Attempt to reverse-engineer, exploit, or circumvent any feature of the Service.</p>
              <p>&gt; Scrape, harvest, or systematically collect data from the Service.</p>
              <p>&gt; Impersonate another person on the public leaderboard.</p>
              <p>&gt; Use the Service for any unlawful purpose.</p>
            </div>
          </section>

          <section>
            <h2 className="font-retro text-xl text-amber mb-3">&gt; PLANS AND BILLING</h2>
            <div className="space-y-2 text-muted leading-relaxed">
              <p><span className="text-foreground">FREE PLAN</span> — 1 No Buy rule, streak tracking, temptation log. No card required.</p>
              <p><span className="text-foreground">PRO PLAN</span> — Unlimited rules, shareable streak cards, 30-day lookback emails. Billed monthly or annually via Stripe.</p>
              <p>&gt; All prices are in EUR and include applicable VAT.</p>
              <p>&gt; Subscriptions renew automatically. Cancel any time from Settings &gt; Manage Subscription.</p>
              <p>&gt; Cancellation takes effect at the end of the current billing period. No partial refunds.</p>
              <p>&gt; We reserve the right to change pricing with 30 days&apos; notice to existing subscribers.</p>
            </div>
          </section>

          <section>
            <h2 className="font-retro text-xl text-amber mb-3">&gt; REFUND POLICY</h2>
            <p className="text-muted leading-relaxed">
              Subscriptions are non-refundable except where required by law (e.g. EU Consumer Rights Directive 14-day cooling-off period for digital services, where applicable). To request a refund, email <a href="mailto:reachout@actvli.com" className="text-amber hover:underline">reachout@actvli.com</a> within 14 days of purchase.
            </p>
          </section>

          <section>
            <h2 className="font-retro text-xl text-amber mb-3">&gt; PUBLIC LEADERBOARD</h2>
            <p className="text-muted leading-relaxed">
              If you set a public display name in Settings, your handle, rule name, category, and streak count may appear on the public leaderboard. You can remove yourself by clearing your display name. No other personal data is made public.
            </p>
          </section>

          <section>
            <h2 className="font-retro text-xl text-amber mb-3">&gt; INTELLECTUAL PROPERTY</h2>
            <p className="text-muted leading-relaxed">
              The Service, its design, and all content created by Äctvli Responsible Consulting are owned by us and protected by copyright. You retain ownership of the content you enter (rules, logs). You grant us a limited licence to store and process that content solely to operate the Service.
            </p>
          </section>

          <section>
            <h2 className="font-retro text-xl text-amber mb-3">&gt; DISCLAIMERS</h2>
            <div className="space-y-2 text-muted leading-relaxed">
              <p>The Service is provided <strong className="text-foreground">&quot;as is&quot;</strong> and <strong className="text-foreground">&quot;as available&quot;</strong>.</p>
              <p>&gt; We do not guarantee uninterrupted or error-free service.</p>
              <p>&gt; NoBuy Streak is a habit-tracking tool — it is not financial advice. Consult a qualified professional for financial decisions.</p>
              <p>&gt; Streak data accuracy depends on your timezone being set correctly. We are not liable for streaks lost due to incorrect timezone settings.</p>
            </div>
          </section>

          <section>
            <h2 className="font-retro text-xl text-amber mb-3">&gt; LIMITATION OF LIABILITY</h2>
            <p className="text-muted leading-relaxed">
              To the maximum extent permitted by law, Äctvli Responsible Consulting shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service. Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="font-retro text-xl text-amber mb-3">&gt; TERMINATION</h2>
            <div className="space-y-2 text-muted leading-relaxed">
              <p>&gt; You may delete your account at any time from Settings. This permanently deletes all your data.</p>
              <p>&gt; We may terminate or suspend your account for breach of these terms, with or without notice.</p>
              <p>&gt; On termination, your right to use the Service ends immediately.</p>
            </div>
          </section>

          <section>
            <h2 className="font-retro text-xl text-amber mb-3">&gt; GOVERNING LAW</h2>
            <p className="text-muted leading-relaxed">
              These terms are governed by the laws of the European Union and the jurisdiction in which Äctvli Responsible Consulting is registered. Any disputes shall be resolved in the competent courts of that jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="font-retro text-xl text-amber mb-3">&gt; CHANGES TO TERMS</h2>
            <p className="text-muted leading-relaxed">
              We may update these terms. We will notify you by email and update the &quot;last updated&quot; date above. Continued use of the Service after changes constitutes acceptance. If you do not accept the new terms, delete your account.
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
