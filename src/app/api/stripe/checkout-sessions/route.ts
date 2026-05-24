import { createStripeCheckoutSession } from "@/modules/stripe/stripe-checkout.service";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    checkoutSessionId?: unknown;
  };

  if (typeof body.checkoutSessionId !== "string" || body.checkoutSessionId.length < 1) {
    return NextResponse.json({ error: "invalid_checkout_session_id" }, { status: 400 });
  }

  const checkoutSession = await createStripeCheckoutSession({
    checkoutSessionId: body.checkoutSessionId
  });

  return NextResponse.json({
    data: checkoutSession
  });
}
