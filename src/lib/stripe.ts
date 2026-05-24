import { env } from "@/lib/env";
import Stripe from "stripe";

const globalForStripe = globalThis as unknown as {
  stripe?: Stripe;
};

function createStripeClient() {
  if (!env.stripeSecretKey) {
    throw new Error("STRIPE_SECRET_KEY is required.");
  }

  return new Stripe(env.stripeSecretKey);
}

export const stripe = globalForStripe.stripe ?? createStripeClient();

if (process.env.NODE_ENV !== "production") {
  globalForStripe.stripe = stripe;
}
