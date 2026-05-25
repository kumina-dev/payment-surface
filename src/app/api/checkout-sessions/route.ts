import { getAuthContext } from "@/modules/auth/auth.service";
import {
  createCheckoutSession,
  listCheckoutSessions
} from "@/modules/checkout-sessions/checkout-sessions.service";
import { NextResponse } from "next/server";

export async function GET() {
  const auth = getAuthContext();

  const checkoutSessions = await listCheckoutSessions({
    merchantId: auth.merchantId
  });

  return NextResponse.json({
    data: checkoutSessions
  });
}

export async function POST(request: Request) {
  const auth = getAuthContext();

  const body = (await request.json()) as {
    title?: unknown;
    description?: unknown;
    amountCents?: unknown;
    currency?: unknown;
  };

  if (typeof body.title !== "string" || body.title.trim().length < 2) {
    return NextResponse.json({ error: "invalid_title" }, { status: 400 });
  }

  if (body.description !== undefined && typeof body.description !== "string") {
    return NextResponse.json({ error: "invalid_description" }, { status: 400 });
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

  const checkoutSession = await createCheckoutSession({
    merchantId: auth.merchantId,
    title: body.title.trim(),
    description: body.description?.trim() || undefined,
    amountCents: body.amountCents,
    currency: body.currency
  });

  return NextResponse.json(
    {
      data: checkoutSession
    },
    {
      status: 201
    }
  );
}
