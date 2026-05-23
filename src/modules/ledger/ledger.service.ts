import type { LedgerEntryDraft } from "@/modules/ledger/ledger.types";

export function createPaymentLedgerDraft(input: {
  merchantId: string;
  paymentIntentId: string;
  amountCents: number;
  currency: string;
}): LedgerEntryDraft {
  return {
    merchantId: input.merchantId,
    paymentIntentId: input.paymentIntentId,
    direction: "credit",
    amountCents: input.amountCents,
    currency: input.currency
  };
}
