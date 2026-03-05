export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";

export async function DELETE() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const service = createServiceClient();

  // Cancel Stripe subscription if exists
  const { data: profile } = await service
    .from("profiles")
    .select("stripe_customer_id, stripe_subscription_id")
    .eq("id", user.id)
    .single();

  if (profile?.stripe_subscription_id) {
    try {
      const stripe = getStripe();
      await stripe.subscriptions.cancel(profile.stripe_subscription_id);
    } catch {
      // Best effort — don't block deletion if Stripe fails
    }
  }

  // Delete avatar from storage if exists
  if (profile) {
    const { data: objects } = await service.storage
      .from("avatars")
      .list(user.id);
    if (objects && objects.length > 0) {
      await service.storage
        .from("avatars")
        .remove(objects.map((o) => `${user.id}/${o.name}`));
    }
  }

  // Delete user from Supabase Auth — cascades to all tables via FK
  const { error } = await service.auth.admin.deleteUser(user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
