import { getAuthContext } from "@/modules/auth/auth.service";
import {
  createPaymentIntent,
  listPaymentIntents
} from "@/modules/payment-intents/payment-intents.service";
import { NextResponse } from "next/server";

export async function GET() {
  const auth = getAuthContext();

  const paymentIntents = await listPaymentIntents({
    merchantId: auth.merchantId
  });

  return NextResponse.json({
    data: paymentIntents
  });
}

export async function POST(request: Request) {
  const auth = getAuthContext();
  const idempotencyKey = request.headers.get("idempotency-key") ?? undefined;
  const body = (await request.json()) as {
    merchantId?: unknown;
    checkoutSessionId?: unknown;
    amountCents?: unknown;
    currency?: unknown;
  };

  if (typeof body.merchantId !== "string" || body.merchantId.length < 1) {
    return NextResponse.json({ error: "invalid_merchant_id" }, { status: 400 });
  }

  if (typeof body.amountCents !== "number" || !Number.isInteger(body.amountCents)) {
    return NextResponse.json({ error: "invalid_amount_cents" }, { status: 400 });
  }

  if (body.amountCents < 50) {
    return NextResponse.json({ error: "amount_too_small" }, { status: 400 });
  }

  if (typeof body.currency !== "string" || body.currency.length !== 3) {
    return NextResponse.json({ error: "invalid_currency" }, { status: 400 });
  }

  if (body.checkoutSessionId !== undefined && typeof body.checkoutSessionId !== "string") {
    return NextResponse.json({ error: "invalid_checkout_session_id" }, { status: 400 });
  }

  const paymentIntent = await createPaymentIntent({
    merchantId: auth.merchantId,
    checkoutSessionId: body.checkoutSessionId,
    amountCents: body.amountCents,
    currency: body.currency,
    idempotencyKey
  });

  return NextResponse.json(
    {
      data: paymentIntent
    },
    {
      status: 201
    }
  );
}
