import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { markCheckoutSessionFailed } from "@/modules/checkout-sessions/checkout-sessions.service";
import {
  markStripePaymentFailed,
  markStripePaymentSucceeded
} from "@/modules/payment-intents/payment-intents.service";
import type Stripe from "stripe";

export function constructStripeWebhookEvent(input: {
  rawBody: string;
  signature: string;
}): Stripe.Event {
  if (!env.stripeWebhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is required.");
  }

  return stripe.webhooks.constructEvent(input.rawBody, input.signature, env.stripeWebhookSecret);
}

export async function handleStripeWebhookEvent(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case "checkout.session.completed": {
      const checkoutSession = event.data.object;
      const localCheckoutSessionId = checkoutSession.metadata?.checkoutSessionId;
      const stripePaymentIntentId =
        typeof checkoutSession.payment_intent === "string" ? checkoutSession.payment_intent : null;

      if (!localCheckoutSessionId || !stripePaymentIntentId) {
        throw new Error("stripe_checkout_session_missing_metadata");
      }

      await markStripePaymentSucceeded({
        checkoutSessionId: localCheckoutSessionId,
        stripePaymentIntentId
      });

      return;
    }

    case "checkout.session.expired": {
      const checkoutSession = event.data.object;
      const localCheckoutSessionId = checkoutSession.metadata?.checkoutSessionId;

      if (localCheckoutSessionId) {
        await markCheckoutSessionFailed(localCheckoutSessionId);
      }

      return;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;
      const checkoutSessionId = paymentIntent.metadata?.checkoutSessionId;
      const failureCode = paymentIntent.last_payment_error?.code ?? "stripe_payment_failed";

      await markStripePaymentFailed({
        checkoutSessionId,
        stripePaymentIntentId: paymentIntent.id,
        failureCode
      });

      return;
    }

    default:
      return;
  }
}
