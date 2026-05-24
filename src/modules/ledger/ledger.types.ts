export type LedgerDirection = "credit" | "debit";

export type LedgerEntryDraft = {
  merchantId: string;
  paymentIntentId?: string;
  direction: LedgerDirection;
  amountCents: number;
  currency: string;
};

export type LedgerEntrySummary = {
  id: string;
  merchantId: string;
  paymentIntentId?: string;
  type: "payment" | "refund" | "fee";
  direction: LedgerDirection;
  amountCents: number;
  currency: string;
  createdAt: string;
};
