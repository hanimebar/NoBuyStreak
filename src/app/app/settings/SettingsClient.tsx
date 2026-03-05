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
      <div className="border border-border bg-card p-5 space-y-3 font-mono text-sm">
        <div>
          <p className="text-xs text-muted uppercase tracking-wider mb-0.5">Email</p>
          <p className="text-foreground">{profile?.email}</p>
        </div>
        <div>
          <p className="text-xs text-muted uppercase tracking-wider mb-0.5">Plan</p>
          <p className={profile?.is_pro ? "text-amber font-retro text-xl" : "text-foreground"}>
            {profile?.is_pro ? "PRO" : "FREE"}
          </p>
        </div>
      </div>

      {profile?.is_pro && (
        <button
          onClick={handleBillingPortal}
          className="w-full border border-border text-foreground px-4 py-2.5 text-sm hover:border-amber hover:text-amber transition"
        >
          MANAGE SUBSCRIPTION
        </button>
      )}

      {!profile?.is_pro && (
        <a
          href="/pricing"
          className="block w-full text-center border border-amber text-amber font-retro text-xl px-4 py-2 hover:bg-amber hover:text-background transition"
        >
          [UPGRADE TO PRO]
        </a>
      )}

      <button
        onClick={handleSignOut}
        className="w-full border border-retro-red text-retro-red px-4 py-2.5 text-sm hover:bg-retro-red hover:text-background transition"
      >
        SIGN OUT
      </button>
    </div>
  );
}
