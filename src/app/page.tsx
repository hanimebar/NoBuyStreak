import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <span className="font-bold text-gray-900">NoBuy Streak</span>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900">Pricing</Link>
          <Link
            href="/login"
            className="text-sm bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition"
          >
            Sign in
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-2xl mx-auto px-6 pt-20 pb-16 text-center">
        <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-4">
          Turn spending restraint into a streak
        </h1>
        <p className="text-lg text-gray-500 mb-8">
          Set No Buy rules, check in daily, and watch your streak grow. Track the money you're
          saving and share your progress with a shareable card.
        </p>
        <Link
          href="/login"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition text-base"
        >
          Start free — no credit card
        </Link>
        <p className="text-xs text-gray-400 mt-3">
          Free plan includes 1 rule. Upgrade for unlimited rules + shareable cards.
        </p>
      </section>

      {/* Features */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              title: "Daily check-ins",
              desc: "One tap — held or slipped. Your streak updates instantly.",
            },
            {
              title: "Temptation log",
              desc: "Log what tempted you and whether you resisted. Revisit it 30 days later.",
            },
            {
              title: "Shareable cards",
              desc: "Download a PNG card showing your streak and money saved. Built for TikTok and Reddit.",
            },
          ].map((f) => (
            <div key={f.title} className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="bg-gray-50 py-16 px-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Simple pricing</h2>
        <p className="text-gray-500 mb-6">Free to start. Pro unlocks everything.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-sm mx-auto">
          <div className="flex-1 bg-white border border-gray-200 rounded-xl p-5 text-left">
            <p className="font-semibold text-gray-900">Free</p>
            <p className="text-2xl font-bold my-1">€0</p>
            <ul className="text-sm text-gray-500 space-y-1 mt-3">
              <li>1 rule</li>
              <li>Streak tracking</li>
              <li>Temptation log</li>
            </ul>
          </div>
          <div className="flex-1 bg-blue-600 rounded-xl p-5 text-left text-white">
            <p className="font-semibold">Pro</p>
            <p className="text-2xl font-bold my-1">€6<span className="text-sm font-normal">/mo</span></p>
            <ul className="text-sm opacity-90 space-y-1 mt-3">
              <li>Unlimited rules</li>
              <li>Shareable PNG cards</li>
              <li>30-day lookback emails</li>
            </ul>
          </div>
        </div>
        <Link href="/pricing" className="inline-block mt-6 text-sm text-blue-600 hover:underline">
          See full pricing →
        </Link>
      </section>

      <footer className="text-center py-8 text-xs text-gray-400">
        <div className="flex gap-4 justify-center mb-2">
          <Link href="/privacy" className="hover:text-gray-600">Privacy</Link>
          <Link href="/terms" className="hover:text-gray-600">Terms</Link>
        </div>
        © {new Date().getFullYear()} NoBuy Streak · reachout@actvli.com
      </footer>
    </div>
  );
}
