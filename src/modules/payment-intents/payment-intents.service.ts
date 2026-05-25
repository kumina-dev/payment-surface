import {
  AuthorizationStatus,
  CaptureStatus,
  LedgerDirection,
  LedgerEntryType,
  PaymentIntentStatus
} from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { markCheckoutSessionFailed, markCheckoutSessionPaid } from "@/modules/checkout-sessions/checkout-sessions.service";
import { createPaymentFailedEvent, createPaymentSucceededEvent } from "@/modules/webhooks/webhook-events.service";
import type { PaymentIntentSummary } from "./payment-intent.types";

type CreatePaymentIntentInput = {
  merchantId: string;
  checkoutSessionId?: string;
  amountCents: number;
  currency: string;
  idempotencyKey?: string;
};

type MarkStripePaymentSucceededInput = {
  checkoutSessionId: string;
  stripePaymentIntentId: string;
};

type MarkStripePaymentFailedInput = {
  checkoutSessionId?: string;
  stripePaymentIntentId?: string;
  failureCode: string;
};

export async function listPaymentIntents(input: {
  merchantId: string;
}): Promise<PaymentIntentSummary[]> {
  const paymentIntents = await prisma.paymentIntent.findMany({
    where: {
      merchantId: input.merchantId
    },
    orderBy: {
      createdAt: "desc"
    },
    take: 50
  });

  return paymentIntents.map(mapPaymentIntent);
}

export async function findPaymentIntentById(id: string): Promise<PaymentIntentSummary | null> {
  const paymentIntent = await prisma.paymentIntent.findUnique({
    where: {
      id
    }
  });

  return paymentIntent ? mapPaymentIntent(paymentIntent) : null;
}

export async function createPaymentIntent(
  input: CreatePaymentIntentInput
): Promise<PaymentIntentSummary> {
  const existingPaymentIntent = input.idempotencyKey
    ? await prisma.paymentIntent.findUnique({
        where: {
          merchantId_idempotencyKey: {
            merchantId: input.merchantId,
            idempotencyKey: input.idempotencyKey
          }
        }
      })
    : null;

  if (existingPaymentIntent) {
    return mapPaymentIntent(existingPaymentIntent);
  }

  const paymentIntent = await prisma.paymentIntent.create({
    data: {
      merchantId: input.merchantId,
      checkoutSessionId: input.checkoutSessionId,
      amountCents: input.amountCents,
      currency: input.currency.toUpperCase(),
      idempotencyKey: input.idempotencyKey
    }
  });

  return mapPaymentIntent(paymentIntent);
}

export async function markStripePaymentSucceeded(
  input: MarkStripePaymentSucceededInput
): Promise<PaymentIntentSummary> {
  const checkoutSession = await prisma.checkoutSession.findUniqueOrThrow({
    where: {
      id: input.checkoutSessionId
    }
  });

  const existingPaymentIntent = await prisma.paymentIntent.findUnique({
    where: {
      checkoutSessionId: checkoutSession.id
    }
  });

  if (existingPaymentIntent?.status === PaymentIntentStatus.SUCCEEDED) {
    return mapPaymentIntent(existingPaymentIntent);
  }

  const succeededPaymentIntent = await prisma.$transaction(async (tx) => {
    const paymentIntent =
      existingPaymentIntent ??
      (await tx.paymentIntent.create({
        data: {
          merchantId: checkoutSession.merchantId,
          checkoutSessionId: checkoutSession.id,
          amountCents: checkoutSession.amountCents,
          currency: checkoutSession.currency,
          stripePaymentIntentId: input.stripePaymentIntentId,
          status: PaymentIntentStatus.PROCESSING
        }
      }));

    const updatedPaymentIntent = await tx.paymentIntent.update({
      where: {
        id: paymentIntent.id
      },
      data: {
        status: PaymentIntentStatus.SUCCEEDED,
        stripePaymentIntentId: input.stripePaymentIntentId
      }
    });

    const existingCapture = await tx.capture.findFirst({
      where: {
        paymentIntentId: paymentIntent.id,
        status: CaptureStatus.SUCCEEDED
      }
    });

    if (!existingCapture) {
      await tx.authorization.create({
        data: {
          paymentIntentId: paymentIntent.id,
          status: AuthorizationStatus.APPROVED,
          amountCents: checkoutSession.amountCents,
          currency: checkoutSession.currency
        }
      });

      await tx.capture.create({
        data: {
          paymentIntentId: paymentIntent.id,
          status: CaptureStatus.SUCCEEDED,
          amountCents: checkoutSession.amountCents,
          currency: checkoutSession.currency
        }
      });

      await tx.ledgerEntry.create({
        data: {
          merchantId: checkoutSession.merchantId,
          paymentIntentId: paymentIntent.id,
          type: LedgerEntryType.PAYMENT,
          direction: LedgerDirection.CREDIT,
          amountCents: checkoutSession.amountCents,
          currency: checkoutSession.currency
        }
      });

      await tx.webhookEvent.create({
        data: createPaymentSucceededEvent({
          paymentIntentId: paymentIntent.id,
          merchantId: checkoutSession.merchantId,
          amountCents: checkoutSession.amountCents,
          currency: checkoutSession.currency
        })
      });
    }

    await tx.checkoutSession.update({
      where: {
        id: checkoutSession.id
      },
      data: {
        status: "PAID"
      }
    });

    return updatedPaymentIntent;
  });

  await markCheckoutSessionPaid(checkoutSession.id);

  return mapPaymentIntent(succeededPaymentIntent);
}

export async function markStripePaymentFailed(
  input: MarkStripePaymentFailedInput
): Promise<PaymentIntentSummary | null> {
  const paymentIntent = input.stripePaymentIntentId
    ? await prisma.paymentIntent.findUnique({
        where: {
          stripePaymentIntentId: input.stripePaymentIntentId
        }
      })
    : input.checkoutSessionId
      ? await prisma.paymentIntent.findUnique({
          where: {
            checkoutSessionId: input.checkoutSessionId
          }
        })
      : null;

  if (!paymentIntent) {
    if (input.checkoutSessionId) {
      await markCheckoutSessionFailed(input.checkoutSessionId);
    }

    return null;
  }

  const failedPaymentIntent = await prisma.$transaction(async (tx) => {
    await tx.authorization.create({
      data: {
        paymentIntentId: paymentIntent.id,
        status: AuthorizationStatus.DECLINED,
        amountCents: paymentIntent.amountCents,
        currency: paymentIntent.currency,
        failureCode: input.failureCode
      }
    });

    const updatedPaymentIntent = await tx.paymentIntent.update({
      where: {
        id: paymentIntent.id
      },
      data: {
        status: PaymentIntentStatus.FAILED
      }
    });

    await tx.webhookEvent.create({
      data: createPaymentFailedEvent({
        paymentIntentId: paymentIntent.id,
        merchantId: paymentIntent.merchantId,
        amountCents: paymentIntent.amountCents,
        currency: paymentIntent.currency,
        failureCode: input.failureCode
      })
    });

    if (paymentIntent.checkoutSessionId) {
      await tx.checkoutSession.update({
        where: {
          id: paymentIntent.checkoutSessionId
        },
        data: {
          status: "FAILED"
        }
      });
    }

    return updatedPaymentIntent;
  });

  return mapPaymentIntent(failedPaymentIntent);
}

function mapPaymentIntent(paymentIntent: {
  id: string;
  merchantId: string;
  amountCents: number;
  currency: string;
  status: PaymentIntentStatus;
  stripePaymentIntentId: string | null;
}): PaymentIntentSummary {
  return {
    id: paymentIntent.id,
    merchantId: paymentIntent.merchantId,
    amountCents: paymentIntent.amountCents,
    currency: paymentIntent.currency,
    status: mapPaymentIntentStatus(paymentIntent.status),
    stripePaymentIntentId: paymentIntent.stripePaymentIntentId ?? undefined
  };
}

function mapPaymentIntentStatus(status: PaymentIntentStatus): PaymentIntentSummary["status"] {
  switch (status) {
    case PaymentIntentStatus.REQUIRES_PAYMENT_METHOD:
      return "requires_payment_method";
    case PaymentIntentStatus.REQUIRES_CONFIRMATION:
      return "requires_confirmation";
    case PaymentIntentStatus.PROCESSING:
      return "processing";
    case PaymentIntentStatus.SUCCEEDED:
      return "succeeded";
    case PaymentIntentStatus.FAILED:
      return "failed";
    case PaymentIntentStatus.CANCELED:
      return "canceled";
    case PaymentIntentStatus.REFUNDED:
      return "refunded";
  }
}
