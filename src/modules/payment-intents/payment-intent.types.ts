export type PaymentIntentStatus =
  | "requires_payment_method"
  | "requires_confirmation"
  | "processing"
  | "succeeded"
  | "failed"
  | "canceled"
  | "refunded";

export type PaymentIntentSummary = {
  id: string;
  merchantId: string;
  amountCents: number;
  currency: string;
  status: PaymentIntentStatus;
};
