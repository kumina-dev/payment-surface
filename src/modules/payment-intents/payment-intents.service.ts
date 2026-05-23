import {
  AuthorizationStatus,
  CaptureStatus,
  LedgerDirection,
  LedgerEntryType,
  PaymentIntentStatus
} from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { markCheckoutSessionPaid } from "@/modules/checkout-sessions/checkout-sessions.service";
import type { PaymentIntentSummary } from "@/modules/payment-intents/payment-intent.types";
import { authorizeTestCard } from "@/modules/payment-methods/test-card-network";
import { createPaymentSucceededEvent } from "@/modules/webhooks/webhook-events.service";

type CreatePaymentIntentInput = {
  merchantId: string;
  checkoutSessionId?: string;
  amountCents: number;
  currency: string;
  idempotencyKey?: string;
};

type ConfirmPaymentIntentInput = {
  merchantId: string;
  amountCents: number;
  currency: string;
  cardNumber: string;
};

type ConfirmPersistedPaymentIntentInput = {
  paymentIntentId: string;
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

export async function confirmPersistedPaymentIntent(
  input: ConfirmPersistedPaymentIntentInput
): Promise<PaymentIntentSummary> {
  const authorizationResult = authorizeTestCard(input.cardNumber);

  const paymentIntent = await prisma.paymentIntent.findUniqueOrThrow({
    where: {
      id: input.paymentIntentId
    }
  });

  if (!authorizationResult.approved) {
    const failedPaymentIntent = await prisma.$transaction(async (tx) => {
      await tx.authorization.create({
        data: {
          paymentIntentId: paymentIntent.id,
          status: AuthorizationStatus.DECLINED,
          amountCents: paymentIntent.amountCents,
          currency: paymentIntent.currency,
          failureCode: authorizationResult.code
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
        data: {
          type: "payment_intent.failed",
          payload: {
            paymentIntentId: paymentIntent.id,
            merchantId: paymentIntent.merchantId,
            amountCents: paymentIntent.amountCents,
            currency: paymentIntent.currency,
            failureCode: authorizationResult.code
          }
        }
      });

      return updatedPaymentIntent;
    });

    return mapPaymentIntent(failedPaymentIntent);
  }

  const succeededPaymentIntent = await prisma.$transaction(async (tx) => {
    await tx.authorization.create({
      data: {
        paymentIntentId: paymentIntent.id,
        status: AuthorizationStatus.APPROVED,
        amountCents: paymentIntent.amountCents,
        currency: paymentIntent.currency
      }
    });

    await tx.capture.create({
      data: {
        paymentIntentId: paymentIntent.id,
        status: CaptureStatus.SUCCEEDED,
        amountCents: paymentIntent.amountCents,
        currency: paymentIntent.currency
      }
    });

    await tx.ledgerEntry.create({
      data: {
        merchantId: paymentIntent.merchantId,
        paymentIntentId: paymentIntent.id,
        type: LedgerEntryType.PAYMENT,
        direction: LedgerDirection.CREDIT,
        amountCents: paymentIntent.amountCents,
        currency: paymentIntent.currency
      }
    });

    const updatedPaymentIntent = await tx.paymentIntent.update({
      where: {
        id: paymentIntent.id
      },
      data: {
        status: PaymentIntentStatus.SUCCEEDED
      }
    });

    await tx.webhookEvent.create({
      data: createPaymentSucceededEvent({
        paymentIntentId: paymentIntent.id,
        merchantId: paymentIntent.merchantId,
        amountCents: paymentIntent.amountCents,
        currency: paymentIntent.currency
      })
    });

    return updatedPaymentIntent;
  });

  if (paymentIntent.checkoutSessionId) {
    await markCheckoutSessionPaid(paymentIntent.checkoutSessionId);
  }

  return mapPaymentIntent(succeededPaymentIntent);
}

function mapPaymentIntent(paymentIntent: {
  id: string;
  merchantId: string;
  amountCents: number;
  currency: string;
  status: PaymentIntentStatus;
}): PaymentIntentSummary {
  return {
    id: paymentIntent.id,
    merchantId: paymentIntent.merchantId,
    amountCents: paymentIntent.amountCents,
    currency: paymentIntent.currency,
    status: mapPaymentIntentStatus(paymentIntent.status)
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
