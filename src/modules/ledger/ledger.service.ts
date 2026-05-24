import { LedgerDirection, LedgerEntryType } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import type { LedgerEntryDraft, LedgerEntrySummary } from "@/modules/ledger/ledger.types";

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

export async function listLedgerEntries(input: {
  merchantId: string;
}): Promise<LedgerEntrySummary[]> {
  const ledgerEntries = await prisma.ledgerEntry.findMany({
    where: {
      merchantId: input.merchantId
    },
    orderBy: {
      createdAt: "desc"
    },
    take: 50
  });

  return ledgerEntries.map((entry) => ({
    id: entry.id,
    merchantId: entry.merchantId,
    paymentIntentId: entry.paymentIntentId ?? undefined,
    type: mapLedgerEntryType(entry.type),
    direction: mapLedgerDirection(entry.direction),
    amountCents: entry.amountCents,
    currency: entry.currency,
    createdAt: entry.createdAt.toISOString()
  }));
}

function mapLedgerEntryType(type: LedgerEntryType): LedgerEntrySummary["type"] {
  switch (type) {
    case LedgerEntryType.PAYMENT:
      return "payment";
    case LedgerEntryType.REFUND:
      return "refund";
    case LedgerEntryType.FEE:
      return "fee";
  }
}

function mapLedgerDirection(direction: LedgerDirection): LedgerEntrySummary["direction"] {
  switch (direction) {
    case LedgerDirection.CREDIT:
      return "credit";
    case LedgerDirection.DEBIT:
      return "debit";
  }
}
