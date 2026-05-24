import { findPaymentIntentById } from "@/modules/payment-intents/payment-intents.service";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    paymentIntentId: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { paymentIntentId } = await context.params;

  const paymentIntent = await findPaymentIntentById(paymentIntentId);

  if (!paymentIntent) {
    return NextResponse.json({ error: "payment_intent_not_found" }, { status: 404 });
  }

  return NextResponse.json({
    data: paymentIntent
  });
}
