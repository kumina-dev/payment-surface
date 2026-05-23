import type { WebhookEventDraft } from "@/modules/webhooks/webhook.types";

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
}): WebhookEventDraft {
  return {
    type: "payment_intent.failed",
    payload: input
  };
}
