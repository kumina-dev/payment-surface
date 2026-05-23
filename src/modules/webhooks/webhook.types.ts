export type WebhookEventType = "payment_intent.succeeded" | "payment_intent.failed";

export type WebhookEventDraft = {
  type: WebhookEventType;
  payload: Record<string, unknown>;
};
