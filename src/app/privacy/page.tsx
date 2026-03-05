import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">← Home</Link>
      <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-6">Privacy Policy</h1>

      <div className="prose prose-sm text-gray-600 space-y-4">
        <p><strong>Last updated:</strong> March 2026</p>

        <h2 className="text-base font-semibold text-gray-800 mt-6">What we collect</h2>
        <p>We collect your email address for authentication, and the data you enter: No Buy rules, daily check-ins, and temptation logs. We store your timezone to calculate streaks correctly.</p>

        <h2 className="text-base font-semibold text-gray-800 mt-6">How we use it</h2>
        <p>Your data is used solely to provide the NoBuy Streak service — tracking your streaks, sending lookback emails, and generating shareable cards. We do not sell your data or use it for advertising.</p>

        <h2 className="text-base font-semibold text-gray-800 mt-6">Third-party services</h2>
        <p>We use Supabase (database + auth), Stripe (payments), and Resend (email). Each has their own privacy policy.</p>

        <h2 className="text-base font-semibold text-gray-800 mt-6">Data deletion</h2>
        <p>You can delete your account from Settings. Deletion removes all your rules, check-ins, and temptation logs permanently.</p>

        <h2 className="text-base font-semibold text-gray-800 mt-6">Contact</h2>
        <p>reachout@actvli.com</p>
      </div>
    </div>
  );
}
