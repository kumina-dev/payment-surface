"use client";

import { useState } from "react";

type CheckoutFormProps = {
  checkoutSessionId: string;
  merchantId: string;
  amountCents: number;
  currency: string;
};

type PaymentIntentResponse = {
  data?: {
    id: string;
    status: string;
  };
  error?: string;
};

export function CheckoutForm({
  checkoutSessionId,
  merchantId,
  amountCents,
  currency
}: CheckoutFormProps) {
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [status, setStatus] = useState<"idle" | "processing" | "succeeded" | "failed">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handlePayment() {
    setStatus("processing");
    setMessage(null);

    const createResponse = await fetch("/api/payment-intents", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "idempotency-key": `checkout_${checkoutSessionId}`
      },
      body: JSON.stringify({
        merchantId,
        checkoutSessionId,
        amountCents,
        currency
      })
    });

    const created = (await createResponse.json()) as PaymentIntentResponse;

    if (!createResponse.ok || !created.data) {
      setStatus("failed");
      setMessage(created.error ?? "payment_intent_create_failed");
      return;
    }

    const confirmResponse = await fetch("/api/payment-intents", {
      method: "PATCH",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        paymentIntentId: created.data.id,
        cardNumber
      })
    });

    const confirmed = (await confirmResponse.json()) as PaymentIntentResponse;

    if (!confirmResponse.ok || !confirmed.data) {
      setStatus("failed");
      setMessage(confirmed.error ?? "payment_intent_confirm_failed");
      return;
    }

    if (confirmed.data.status === "succeeded") {
      setStatus("succeeded");
      setMessage("Payment succeeded.");
      return;
    }

    setStatus("failed");
    setMessage(`Payment failed: ${confirmed.data.status}`);
  }

  return (
    <div className="mt-8 space-y-4">
      <label className="block">
        <span className="text-sm text-zinc-400">Test card</span>
        <input
          name="cardNumber"
          value={cardNumber}
          onChange={(event) => setCardNumber(event.target.value)}
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-zinc-50 outline-none"
        />
      </label>

      <button
        type="button"
        onClick={handlePayment}
        disabled={status === "processing"}
        className="w-full rounded-xl bg-violet-500 px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "processing" ? "Processing..." : "Pay in test mode"}
      </button>

      {message ? (
        <div
          className={
            status === "succeeded"
              ? "rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300"
              : "rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          }
        >
          {message}
        </div>
      ) : null}

      <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-400">
        <p>Success: 4242 4242 4242 4242</p>
        <p>Declined: 4000 0000 0000 0002</p>
        <p>Insufficient funds: 4000 0000 0000 9995</p>
      </div>
    </div>
  );
}
