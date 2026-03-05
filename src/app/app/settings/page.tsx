export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("email, is_pro, stripe_subscription_id, display_name, avatar_url, country, birth_year, lookback_emails")
    .eq("id", user.id)
    .single();

  // Detect auth provider so we can hide/show password change
  const provider = user.app_metadata?.provider ?? "email";

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-8">
        <p className="font-mono text-xs text-muted tracking-widest mb-1">C:\NOBUY&gt; settings.exe</p>
        <h1 className="font-retro text-4xl text-amber">ACCOUNT</h1>
      </div>
      <SettingsClient profile={profile} provider={provider} userId={user.id} />
    </div>
  );
}
