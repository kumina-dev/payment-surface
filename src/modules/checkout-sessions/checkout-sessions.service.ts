import { CheckoutSessionStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import type { CheckoutSessionSummary } from "./checkout-session.types";

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

export async function findCheckoutSessionByStripeId(
  stripeCheckoutSessionId: string
): Promise<CheckoutSessionSummary | null> {
  const checkoutSession = await prisma.checkoutSession.findUnique({
    where: {
      stripeCheckoutSessionId
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

export async function attachStripeCheckoutSession(input: {
  checkoutSessionId: string;
  stripeCheckoutSessionId: string;
  stripeCheckoutUrl: string;
}): Promise<CheckoutSessionSummary> {
  const checkoutSession = await prisma.checkoutSession.update({
    where: {
      id: input.checkoutSessionId
    },
    data: {
      stripeCheckoutSessionId: input.stripeCheckoutSessionId,
      stripeCheckoutUrl: input.stripeCheckoutUrl
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

export async function markCheckoutSessionFailed(id: string): Promise<void> {
  await prisma.checkoutSession.update({
    where: {
      id
    },
    data: {
      status: CheckoutSessionStatus.FAILED
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
  stripeCheckoutSessionId: string | null;
  stripeCheckoutUrl: string | null;
}): CheckoutSessionSummary {
  return {
    id: checkoutSession.id,
    merchantId: checkoutSession.merchantId,
    title: checkoutSession.title,
    description: checkoutSession.description ?? undefined,
    amountCents: checkoutSession.amountCents,
    currency: checkoutSession.currency,
    status: mapCheckoutSessionStatus(checkoutSession.status),
    stripeCheckoutSessionId: checkoutSession.stripeCheckoutSessionId ?? undefined,
    stripeCheckoutUrl: checkoutSession.stripeCheckoutUrl ?? undefined
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
