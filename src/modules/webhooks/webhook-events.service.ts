import { WebhookEventStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import crypto from "node:crypto";
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

  return events.map(mapWebhookEvent);
}

export async function markWebhookEventDelivered(id: string): Promise<WebhookEventSummary> {
  const event = await prisma.webhookEvent.update({
    where: {
      id
    },
    data: {
      status: WebhookEventStatus.DELIVERED,
      attempts: {
        increment: 1
      },
      deliveredAt: new Date()
    }
  });

  return mapWebhookEvent(event);
}

export async function markWebhookEventFailed(id: string): Promise<WebhookEventSummary> {
  const event = await prisma.webhookEvent.update({
    where: {
      id
    },
    data: {
      status: WebhookEventStatus.FAILED,
      attempts: {
        increment: 1
      }
    }
  });

  return mapWebhookEvent(event);
}

export function createWebhookSignature(input: {
  payload: string;
  secret: string;
  timestamp: number;
}): string {
  const signedPayload = `${input.timestamp}.${input.payload}`;

  return crypto.createHmac("sha256", input.secret).update(signedPayload).digest("hex");
}

export function createWebhookDeliveryHeaders(input: {
  payload: string;
  secret: string;
  timestamp?: number;
}): Headers {
  const timestamp = input.timestamp ?? Math.floor(Date.now() / 1000);
  const signature = createWebhookSignature({
    payload: input.payload,
    secret: input.secret,
    timestamp
  });

  return new Headers({
    "content-type": "application/json",
    "payment-surface-timestamp": timestamp.toString(),
    "payment-surface-signature": signature
  });
}

function mapWebhookEvent(event: {
  id: string;
  type: string;
  payload: WebhookEventSummary["payload"];
  status: WebhookEventStatus;
  attempts: number;
  createdAt: Date;
  deliveredAt: Date | null;
}): WebhookEventSummary {
  return {
    id: event.id,
    type: event.type,
    payload: event.payload,
    status: mapWebhookEventStatus(event.status),
    attempts: event.attempts,
    createdAt: event.createdAt.toISOString(),
    deliveredAt: event.deliveredAt?.toISOString()
  };
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
