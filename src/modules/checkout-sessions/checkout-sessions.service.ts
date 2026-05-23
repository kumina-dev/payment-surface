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
