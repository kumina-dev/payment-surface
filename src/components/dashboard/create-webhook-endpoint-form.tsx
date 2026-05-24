"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type CreateWebhookEndpointResponse = {
  data?: {
    id: string;
  };
  error?: string;
};

export function CreateWebhookEndpointForm() {
  const router = useRouter();

  const [url, setUrl] = useState("https://example.com/webhooks/payment-surface");
  const [status, setStatus] = useState<"idle" | "creating" | "failed">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    setStatus("creating");
    setError(null);

    const response = await fetch("/api/webhook-endpoints", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        url
      })
    });

    const result = (await response.json()) as CreateWebhookEndpointResponse;

    if (!response.ok || !result.data) {
      setStatus("failed");
      setError(result.error ?? "webhook_endpoint_create_failed");
      return;
    }

    router.refresh();
    setStatus("idle");
    setUrl("https://example.com/webhooks/payment-surface");
  }

  return (
    <section className="mt-8 rounded-2xl border border-white/10 bg-white/3">
      <div className="border-b border-white/10 p-5">
        <h2 className="text-lg font-medium text-zinc-50">Create webhook endpoint</h2>
      </div>

      <div className="grid gap-4 p-5 md:grid-cols-[1fr_auto]">
        <label className="block">
          <span className="text-sm text-zinc-400">Endpoint URL</span>
          <input
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-zinc-50 outline-none"
          />
        </label>

        <div className="flex items-end">
          <button
            type="button"
            onClick={handleCreate}
            disabled={status === "creating"}
            className="w-full rounded-xl bg-violet-500 px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
          >
            {status === "creating" ? "Creating..." : "Create endpoint"}
          </button>
        </div>
      </div>

      {error ? (
        <div className="border-t border-white/10 p-5">
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        </div>
      ) : null}
    </section>
  );
}
