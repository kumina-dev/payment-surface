import type { PaymentIntentSummary } from "@/modules/payment-intents/payment-intent.types";
import { authorizeTestCard } from "@/modules/payment-methods/test-card-network";

type ConfirmPaymentIntentInput = {
  merchantId: string;
  amountCents: number;
  currency: string;
  cardNumber: string;
};

export function confirmTestPaymentIntent(input: ConfirmPaymentIntentInput): PaymentIntentSummary {
  const authorization = authorizeTestCard(input.cardNumber);

  return {
    id: `pi_${crypto.randomUUID().replaceAll("-", "")}`,
    merchantId: input.merchantId,
    amountCents: input.amountCents,
    currency: input.currency,
    status: authorization.approved ? "succeeded" : "failed"
  };
}
