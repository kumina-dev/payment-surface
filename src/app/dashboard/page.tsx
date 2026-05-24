import { DashboardSection } from "@/components/dashboard/dashboard-section";
import { EmptyState } from "@/components/dashboard/empty-state";
import { getDemoAuthContext } from "@/modules/auth/auth.service";
import {
  formatMoney,
  listCheckoutSessions
} from "@/modules/checkout-sessions/checkout-sessions.service";
import { listLedgerEntries } from "@/modules/ledger/ledger.service";
import { getDemoMerchant } from "@/modules/merchants/merchants.service";
import { listPaymentIntents } from "@/modules/payment-intents/payment-intents.service";
import { listWebhookEvents } from "@/modules/webhooks/webhook-events.service";
import Link from "next/link";
import { CreateCheckoutSessionForm } from "./create-checkout-session-form";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const auth = getDemoAuthContext();
  const merchant = getDemoMerchant();

  const [checkoutSessions, paymentIntents, ledgerEntries, webhookEvents] = await Promise.all([
    listCheckoutSessions({
      merchantId: auth.merchantId
    }),
    listPaymentIntents({
      merchantId: auth.merchantId
    }),
    listLedgerEntries({
      merchantId: auth.merchantId
    }),
    listWebhookEvents()
  ]);

  const totalVolumeCents = checkoutSessions.reduce((total, session) => {
    return session.status === "paid" ? total + session.amountCents : total;
  }, 0);

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-6 py-12">
      <header className="flex items-center justify-between border-b border-white/10 pb-8">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-zinc-500">Dashboard</p>
          <h1 className="mt-3 text-3xl font-semibold text-zinc-50">{merchant.name}</h1>
        </div>
        <Link
          href="/pay/checkout_demo"
          className="rounded-xl bg-violet-500 px-5 py-3 text-sm font-medium text-white"
        >
          Open demo checkout
        </Link>
      </header>

      <section className="mt-8 grid gap-4 md:grid-cols-4">
        <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-zinc-500">Paid volume</p>
          <p className="mt-2 text-3xl font-semibold text-zinc-50">
            {formatMoney(totalVolumeCents, "EUR")}
          </p>
        </article>
        <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-zinc-500">Checkout sessions</p>
          <p className="mt-2 text-3xl font-semibold text-zinc-50">{checkoutSessions.length}</p>
        </article>
        <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-zinc-500">Payment intents</p>
          <p className="mt-2 text-3xl font-semibold text-zinc-50">{paymentIntents.length}</p>
        </article>
        <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-zinc-500">Webhook events</p>
          <p className="mt-2 text-3xl font-semibold text-zinc-50">{webhookEvents.length}</p>
        </article>
      </section>

      <CreateCheckoutSessionForm />

      <DashboardSection title="Checkout sessions">
        <div className="grid grid-cols-5 gap-4 p-5 text-sm text-zinc-400">
          <span>ID</span>
          <span>Title</span>
          <span>Amount</span>
          <span>Status</span>
          <span>Link</span>
        </div>

        {checkoutSessions.map((checkoutSession) => (
          <div
            key={checkoutSession.id}
            className="grid grid-cols-5 gap-4 border-t border-white/10 p-5 text-sm text-zinc-100"
          >
            <span className="truncate">{checkoutSession.id}</span>
            <span>{checkoutSession.title}</span>
            <span>{formatMoney(checkoutSession.amountCents, checkoutSession.currency)}</span>
            <span>{checkoutSession.status}</span>
            <Link href={`/pay/${checkoutSession.id}`} className="text-violet-300">
              Open
            </Link>
          </div>
        ))}

        {checkoutSessions.length === 0 ? <EmptyState>No checkout sessions yet.</EmptyState> : null}
      </DashboardSection>

      <DashboardSection title="Payment intents">
        <div className="grid grid-cols-5 gap-4 p-5 text-sm text-zinc-400">
          <span>ID</span>
          <span>Merchant</span>
          <span>Amount</span>
          <span>Status</span>
          <span>API</span>
        </div>

        {paymentIntents.map((paymentIntent) => (
          <div
            key={paymentIntent.id}
            className="grid grid-cols-5 gap-4 border-t border-white/10 p-5 text-sm text-zinc-100"
          >
            <span className="truncate">{paymentIntent.id}</span>
            <span className="truncate">{paymentIntent.merchantId}</span>
            <span>{formatMoney(paymentIntent.amountCents, paymentIntent.currency)}</span>
            <span>{paymentIntent.status}</span>
            <Link href={`/api/payment-intents/${paymentIntent.id}`} className="text-violet-300">
              JSON
            </Link>
          </div>
        ))}

        {paymentIntents.length === 0 ? <EmptyState>No payment intents yet.</EmptyState> : null}
      </DashboardSection>

      <DashboardSection title="Ledger">
        <div className="grid grid-cols-6 gap-4 p-5 text-sm text-zinc-400">
          <span>ID</span>
          <span>Type</span>
          <span>Direction</span>
          <span>Amount</span>
          <span>Payment intent</span>
          <span>Created</span>
        </div>

        {ledgerEntries.map((entry) => (
          <div
            key={entry.id}
            className="grid grid-cols-6 gap-4 border-t border-white/10 p-5 text-sm text-zinc-100"
          >
            <span className="truncate">{entry.id}</span>
            <span>{entry.type}</span>
            <span>{entry.direction}</span>
            <span>{formatMoney(entry.amountCents, entry.currency)}</span>
            <span className="truncate">{entry.paymentIntentId ?? "none"}</span>
            <span>{new Date(entry.createdAt).toLocaleString("en")}</span>
          </div>
        ))}

        {ledgerEntries.length === 0 ? <EmptyState>No ledger entries yet.</EmptyState> : null}
      </DashboardSection>

      <DashboardSection title="Webhook events">
        <div className="grid grid-cols-5 gap-4 p-5 text-sm text-zinc-400">
          <span>ID</span>
          <span>Type</span>
          <span>Status</span>
          <span>Attempts</span>
          <span>Created</span>
        </div>

        {webhookEvents.map((event) => (
          <div
            key={event.id}
            className="grid grid-cols-5 gap-4 border-t border-white/10 p-5 text-sm text-zinc-100"
          >
            <span className="truncate">{event.id}</span>
            <span className="truncate">{event.type}</span>
            <span>{event.status}</span>
            <span>{event.attempts}</span>
            <span>{new Date(event.createdAt).toLocaleString("en")}</span>
          </div>
        ))}

        {webhookEvents.length === 0 ? <EmptyState>No webhook events yet.</EmptyState> : null}
      </DashboardSection>
    </main>
  );
}
