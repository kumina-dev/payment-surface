import type { Prisma } from "@/generated/prisma/client";

export type WebhookEventType = "payment_intent.succeeded" | "payment_intent.failed";

export type WebhookEventDraft = {
  type: WebhookEventType;
  payload: Prisma.InputJsonValue;
};

export type WebhookEventSummary = {
  id: string;
  type: string;
  payload: Prisma.JsonValue;
  status: "pending" | "delivered" | "failed";
  attempts: number;
  createdAt: string;
  deliveredAt?: string;
};

export type WebhookEndpointSummary = {
  id: string;
  merchantId: string;
  url: string;
  enabled: boolean;
  createdAt: string;
};
