"use client";

import { useState } from "react";

type StripeCheckoutButtonProps = {
  checkoutSessionId: string;
};

type StripeCheckoutSessionResponse = {
  data?: {
    id: string;
    url: string;
  };
  error?: string;
};

export function StripeCheckoutButton({ checkoutSessionId }: StripeCheckoutButtonProps) {
  const [status, setStatus] = useState<"idle" | "redirecting" | "failed">("idle");
  const [error, setError] = useState<string | null>(null);

  async function redirectToStripeCheckout() {
    setStatus("redirecting");
    setError(null);

    const response = await fetch("/api/stripe/checkout-sessions", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        checkoutSessionId
      })
    });

    const result = (await response.json()) as StripeCheckoutSessionResponse;

    if (!response.ok || !result.data) {
      setStatus("failed");
      setError(result.error ?? "stripe_checkout_session_create_failed");
      return;
    }

    window.location.href = result.data.url;
  }

  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={redirectToStripeCheckout}
        disabled={status === "redirecting"}
        className="w-full rounded-xl bg-violet-500 px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "redirecting" ? "Redirecting..." : "Pay with Stripe"}
      </button>

      {error ? (
        <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}
