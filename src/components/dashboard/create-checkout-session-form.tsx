"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type CreateCheckoutSessionResponse = {
  data?: {
    id: string;
  };
  error?: string;
};

export function CreateCheckoutSessionForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("EUR");
  const [status, setStatus] = useState<"idle" | "creating" | "failed">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    setStatus("creating");
    setError(null);

    const amountCents = Math.round(Number(amount.replace(",", ".")) * 100);

    if (!Number.isInteger(amountCents) || amountCents < 50) {
      setStatus("failed");
      setError("Amount must be at least 0.50.");
      return;
    }

    const response = await fetch("/api/checkout-sessions", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        title,
        description,
        amountCents,
        currency
      })
    });

    const result = (await response.json()) as CreateCheckoutSessionResponse;

    if (!response.ok || !result.data) {
      setStatus("failed");
      setError(result.error ?? "checkout_session_create_failed");
      return;
    }

    router.refresh();
    setStatus("idle");
    setTitle("");
    setDescription("");
    setAmount("");
    setCurrency("EUR");
  }

  return (
    <section className="mt-8 rounded-2xl border border-white/10 bg-white/3">
      <div className="border-b border-white/10 p-5">
        <h2 className="text-lg font-medium text-zinc-50">Create checkout session</h2>
      </div>

      <div className="grid gap-4 p-5 md:grid-cols-2">
        <label className="block">
          <span className="text-sm text-zinc-400">Title</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Product or service name"
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-zinc-50 outline-none"
          />
        </label>

        <label className="block">
          <span className="text-sm text-zinc-400">Amount</span>
          <input
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="19.99"
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-zinc-50 outline-none"
          />
        </label>

        <label className="block">
          <span className="text-sm text-zinc-400">Currency</span>
          <input
            value={currency}
            onChange={(event) => setCurrency(event.target.value.toUpperCase())}
            maxLength={3}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-zinc-50 outline-none"
          />
        </label>

        <label className="block">
          <span className="text-sm text-zinc-400">Description</span>
          <input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Optional"
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-zinc-50 outline-none"
          />
        </label>
      </div>

      <div className="border-t border-white/10 p-5">
        <button
          type="button"
          onClick={handleCreate}
          disabled={status === "creating"}
          className="rounded-xl bg-violet-500 px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "creating" ? "Creating..." : "Create session"}
        </button>

        {error ? (
          <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        ) : null}
      </div>
    </section>
  );
}
