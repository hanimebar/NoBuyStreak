"use client";

import { createClient } from "@/lib/supabase/client";

interface Props {
  profile: {
    email: string;
    is_pro: boolean;
    stripe_subscription_id: string | null;
  } | null;
}

export default function SettingsClient({ profile }: Props) {
  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  async function handleBillingPortal() {
    const res = await fetch("/api/billing-portal", { method: "POST" });
    if (res.ok) {
      const { url } = await res.json();
      window.location.href = url;
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <div>
          <p className="text-xs text-gray-400">Email</p>
          <p className="text-sm text-gray-800">{profile?.email}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Plan</p>
          <p className="text-sm text-gray-800 font-medium">
            {profile?.is_pro ? "Pro" : "Free"}
          </p>
        </div>
      </div>

      {profile?.is_pro && (
        <button
          onClick={handleBillingPortal}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
        >
          Manage subscription
        </button>
      )}

      {!profile?.is_pro && (
        <a
          href="/pricing"
          className="block w-full text-center bg-blue-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-blue-700 transition"
        >
          Upgrade to Pro
        </a>
      )}

      <button
        onClick={handleSignOut}
        className="w-full border border-red-200 text-red-600 rounded-lg px-4 py-2.5 text-sm hover:bg-red-50 transition"
      >
        Sign out
      </button>
    </div>
  );
}
