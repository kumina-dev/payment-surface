import { WebhookEventStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import type { WebhookEventDraft, WebhookEventSummary } from "./webhook.types";

export function createPaymentSucceededEvent(input: {
  paymentIntentId: string;
  merchantId: string;
  amountCents: number;
  currency: string;
}): WebhookEventDraft {
  return {
    type: "payment_intent.succeeded",
    payload: input
  };
}

export function createPaymentFailedEvent(input: {
  paymentIntentId: string;
  merchantId: string;
  amountCents: number;
  currency: string;
  failureCode: string;
}): WebhookEventDraft {
  return {
    type: "payment_intent.failed",
    payload: input
  };
}

export async function listWebhookEvents(): Promise<WebhookEventSummary[]> {
  const events = await prisma.webhookEvent.findMany({
    orderBy: {
      createdAt: "desc"
    },
    take: 50
  });

  return events.map((event) => ({
    id: event.id,
    type: event.type,
    payload: event.payload,
    status: mapWebhookEventStatus(event.status),
    attempts: event.attempts,
    createdAt: event.createdAt.toISOString(),
    deliveredAt: event.deliveredAt?.toISOString()
  }));
}

function mapWebhookEventStatus(status: WebhookEventStatus): WebhookEventSummary["status"] {
  switch (status) {
    case WebhookEventStatus.PENDING:
      return "pending";
    case WebhookEventStatus.DELIVERED:
      return "delivered";
    case WebhookEventStatus.FAILED:
      return "failed";
  }
}
