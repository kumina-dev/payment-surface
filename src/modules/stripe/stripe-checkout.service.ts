import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import {
  attachStripeCheckoutSession,
  findCheckoutSessionById
} from "@/modules/checkout-sessions/checkout-sessions.service";

export async function createStripeCheckoutSession(input: {
  checkoutSessionId: string;
}): Promise<{
  id: string;
  url: string;
}> {
  const checkoutSession = await findCheckoutSessionById(input.checkoutSessionId);

  if (!checkoutSession) {
    throw new Error("checkout_session_not_found");
  }

  if (checkoutSession.stripeCheckoutSessionId && checkoutSession.stripeCheckoutUrl) {
    return {
      id: checkoutSession.stripeCheckoutSessionId,
      url: checkoutSession.stripeCheckoutUrl
    };
  }

  const stripeCheckoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${env.appUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.appUrl}/payment/cancelled`,
    client_reference_id: checkoutSession.id,
    metadata: {
      checkoutSessionId: checkoutSession.id,
      merchantId: checkoutSession.merchantId
    },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: checkoutSession.currency.toLowerCase(),
          unit_amount: checkoutSession.amountCents,
          product_data: {
            name: checkoutSession.title,
            description: checkoutSession.description
          }
        }
      }
    ]
  });

  if (!stripeCheckoutSession.url) {
    throw new Error("stripe_checkout_session_missing_url");
  }

  await attachStripeCheckoutSession({
    checkoutSessionId: checkoutSession.id,
    stripeCheckoutSessionId: stripeCheckoutSession.id,
    stripeCheckoutUrl: stripeCheckoutSession.url
  });

  return {
    id: stripeCheckoutSession.id,
    url: stripeCheckoutSession.url
  };
}
