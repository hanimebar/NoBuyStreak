export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature")!;
  const stripe = getStripe();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json({ error: "Webhook signature invalid" }, { status: 400 });
  }

  const service = createServiceClient();

  // Idempotency check
  const { data: existing } = await service
    .from("webhook_events")
    .select("id")
    .eq("id", event.id)
    .single();

  if (existing) {
    return NextResponse.json({ received: true });
  }

  await service.from("webhook_events").insert({ id: event.id, type: event.type });

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as {
      client_reference_id: string;
      customer: string;
      subscription: string;
    };
    const userId = session.client_reference_id;
    await service.from("profiles").update({
      is_pro: true,
      stripe_customer_id: session.customer,
      stripe_subscription_id: session.subscription,
    }).eq("id", userId);
  }

  if (event.type === "customer.subscription.updated") {
    const sub = event.data.object as { id: string; status: string };
    const isPro = sub.status === "active" || sub.status === "trialing";
    await service.from("profiles").update({ is_pro: isPro })
      .eq("stripe_subscription_id", sub.id);
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as { id: string };
    await service.from("profiles").update({
      is_pro: false,
      stripe_subscription_id: null,
    }).eq("stripe_subscription_id", sub.id);
  }

  return NextResponse.json({ received: true });
}
