import {
  constructStripeWebhookEvent,
  handleStripeWebhookEvent
} from "@/modules/stripe/stripe-webhook.service";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "missing_stripe_signature" }, { status: 400 });
  }

  const rawBody = await request.text();

  try {
    const event = constructStripeWebhookEvent({
      rawBody,
      signature
    });

    await handleStripeWebhookEvent(event);

    return NextResponse.json({
      received: true
    });
  } catch {
    return NextResponse.json({ error: "stripe_webhook_error" }, { status: 400 });
  }
}
