import { getAuthContext } from "@/modules/auth/auth.service";
import { listPaymentIntents } from "@/modules/payment-intents/payment-intents.service";
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
