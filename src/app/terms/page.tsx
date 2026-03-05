import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">← Home</Link>
      <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-6">Terms of Service</h1>

      <div className="prose prose-sm text-gray-600 space-y-4">
        <p><strong>Last updated:</strong> March 2026</p>

        <h2 className="text-base font-semibold text-gray-800 mt-6">Use of service</h2>
        <p>NoBuy Streak is provided by Äctvli Responsible Consulting. You may use the service for personal, non-commercial purposes. Do not attempt to abuse, reverse-engineer, or circumvent any limits of the service.</p>

        <h2 className="text-base font-semibold text-gray-800 mt-6">Accounts</h2>
        <p>You are responsible for keeping your account credentials secure. We may suspend accounts that violate these terms.</p>

        <h2 className="text-base font-semibold text-gray-800 mt-6">Payments</h2>
        <p>Pro subscriptions are billed monthly (€6) or annually (€39) via Stripe. You can cancel at any time from Settings. No refunds for partial periods.</p>

        <h2 className="text-base font-semibold text-gray-800 mt-6">Limitation of liability</h2>
        <p>The service is provided "as is". We are not liable for any damages arising from your use of the service.</p>

        <h2 className="text-base font-semibold text-gray-800 mt-6">Contact</h2>
        <p>reachout@actvli.com</p>
      </div>
    </div>
  );
}
