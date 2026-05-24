import { listWebhookEvents } from "@/modules/webhooks/webhook-events.service";
import { NextResponse } from "next/server";

export async function GET() {
  const events = await listWebhookEvents();

  return NextResponse.json({
    data: events
  });
}
