export type LedgerDirection = "credit" | "debit";

export type LedgerEntryDraft = {
  merchantId: string;
  paymentIntentId?: string;
  direction: LedgerDirection;
  amountCents: number;
  currency: string;
};
