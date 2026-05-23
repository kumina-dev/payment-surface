export type CheckoutSessionStatus = "pending" | "paid" | "failed" | "expired";

export type CheckoutSessionSummary = {
  id: string;
  merchantId: string;
  title: string;
  description?: string;
  amountCents: number;
  currency: string;
  status: CheckoutSessionStatus;
};
