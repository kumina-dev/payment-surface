import { CheckoutSessionStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import type { CheckoutSessionSummary } from "@/modules/checkout-sessions/checkout-session.types";

export function getDemoCheckoutSession(): CheckoutSessionSummary {
  return {
    id: "checkout_demo",
    merchantId: "merchant_demo",
    title: "Demo Merchant",
    description: "A fake payment flow. Because real card networks are not a weekend toy.",
    amountCents: 1999,
    currency: "EUR",
    status: "pending"
  };
}

export function formatMoney(amountCents: number, currency: string): string {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency
  }).format(amountCents / 100);
}

export async function listCheckoutSessions(input: {
  merchantId: string;
}): Promise<CheckoutSessionSummary[]> {
  const checkoutSessions = await prisma.checkoutSession.findMany({
    where: {
      merchantId: input.merchantId
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return checkoutSessions.map(mapCheckoutSession);
}

export async function findCheckoutSessionById(id: string): Promise<CheckoutSessionSummary | null> {
  const checkoutSession = await prisma.checkoutSession.findUnique({
    where: {
      id
    }
  });

  return checkoutSession ? mapCheckoutSession(checkoutSession) : null;
}

export async function createCheckoutSession(input: {
  merchantId: string;
  title: string;
  description?: string;
  amountCents: number;
  currency: string;
}): Promise<CheckoutSessionSummary> {
  const checkoutSession = await prisma.checkoutSession.create({
    data: {
      merchantId: input.merchantId,
      title: input.title,
      description: input.description,
      amountCents: input.amountCents,
      currency: input.currency.toUpperCase()
    }
  });

  return mapCheckoutSession(checkoutSession);
}

export async function markCheckoutSessionPaid(id: string): Promise<void> {
  await prisma.checkoutSession.update({
    where: {
      id
    },
    data: {
      status: CheckoutSessionStatus.PAID
    }
  });
}

function mapCheckoutSession(checkoutSession: {
  id: string;
  merchantId: string;
  title: string;
  description: string | null;
  amountCents: number;
  currency: string;
  status: CheckoutSessionStatus;
}): CheckoutSessionSummary {
  return {
    id: checkoutSession.id,
    merchantId: checkoutSession.merchantId,
    title: checkoutSession.title,
    description: checkoutSession.description ?? undefined,
    amountCents: checkoutSession.amountCents,
    currency: checkoutSession.currency,
    status: mapCheckoutSessionStatus(checkoutSession.status)
  };
}

function mapCheckoutSessionStatus(status: CheckoutSessionStatus): CheckoutSessionSummary["status"] {
  switch (status) {
    case CheckoutSessionStatus.PENDING:
      return "pending";
    case CheckoutSessionStatus.PAID:
      return "paid";
    case CheckoutSessionStatus.FAILED:
      return "failed";
    case CheckoutSessionStatus.EXPIRED:
      return "expired";
  }
}
