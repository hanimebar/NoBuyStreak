export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";

// Lets a user self-heal if the Stripe webhook missed.
// Looks up their Stripe customer, checks for an active subscription, and syncs is_pro.
export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const service = createServiceClient();
  const { data: profile } = await service
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  if (!profile?.stripe_customer_id) {
    return NextResponse.json({ error: "No Stripe customer found. Complete a purchase first." }, { status: 400 });
  }

  const stripe = getStripe();
  const subscriptions = await stripe.subscriptions.list({
    customer: profile.stripe_customer_id,
    status: "active",
    limit: 1,
  });

  const active = subscriptions.data[0];
  if (!active) {
    return NextResponse.json({ error: "No active subscription found." }, { status: 400 });
  }

  await service.from("profiles").update({
    is_pro: true,
    stripe_subscription_id: active.id,
  }).eq("id", user.id);

  return NextResponse.json({ ok: true });
}
