import { CreateCheckoutSessionForm } from "@/app/dashboard/create-checkout-session-form";
import { getDemoAuthContext } from "@/modules/auth/auth.service";
import {
  formatMoney,
  listCheckoutSessions
} from "@/modules/checkout-sessions/checkout-sessions.service";
import { getDemoMerchant } from "@/modules/merchants/merchants.service";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const auth = getDemoAuthContext();
  const merchant = getDemoMerchant();

  const checkoutSessions = await listCheckoutSessions({
    merchantId: auth.merchantId
  });

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

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-white/10 bg-white/3 p-5">
          <p className="text-sm text-zinc-500">Paid volume</p>
          <p className="mt-2 text-3xl font-semibold text-zinc-50">
            {formatMoney(totalVolumeCents, "EUR")}
          </p>
        </article>
        <article className="rounded-2xl border border-white/10 bg-white/3 p-5">
          <p className="text-sm text-zinc-500">Checkout sessions</p>
          <p className="mt-2 text-3xl font-semibold text-zinc-50">{checkoutSessions.length}</p>
        </article>
        <article className="rounded-2xl border border-white/10 bg-white/3 p-5">
          <p className="text-sm text-zinc-500">Mode</p>
          <p className="mt-2 text-3xl font-semibold text-zinc-50">Test</p>
        </article>
      </section>

      <CreateCheckoutSessionForm />

      <section className="mt-8 rounded-2xl border border-white/10 bg-white/3">
        <div className="border-b border-white/10 p-5">
          <h2 className="text-lg font-medium text-zinc-50">Checkout sessions</h2>
        </div>

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

        {checkoutSessions.length === 0 ? (
          <div className="border-t border-white/10 p-5 text-sm text-zinc-500">
            No checkout sessions yet.
          </div>
        ) : null}
      </section>
    </main>
  );
}
