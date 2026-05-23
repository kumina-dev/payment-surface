import { findCheckoutSessionById } from "@/modules/checkout-sessions/checkout-sessions.service";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    checkoutSessionId: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { checkoutSessionId } = await context.params;

  const checkoutSession = await findCheckoutSessionById(checkoutSessionId);

  if (!checkoutSession) {
    return NextResponse.json({ error: "checkout_session_not_found" }, { status: 400 });
  }

  return NextResponse.json({
    data: checkoutSession
  });
}
