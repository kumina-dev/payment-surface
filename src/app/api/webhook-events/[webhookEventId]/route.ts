import {
  markWebhookEventDelivered,
  markWebhookEventFailed
} from "@/modules/webhooks/webhook-events.service";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    webhookEventId: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { webhookEventId } = await context.params;

  const body = (await request.json()) as {
    status?: unknown;
  };

  if (body.status === "delivered") {
    const event = await markWebhookEventDelivered(webhookEventId);

    return NextResponse.json({
      data: event
    });
  }

  if (body.status === "failed") {
    const event = await markWebhookEventFailed(webhookEventId);

    return NextResponse.json({
      data: event
    });
  }

  return NextResponse.json({ error: "invalid_webhook_event_status" }, { status: 400 });
}
