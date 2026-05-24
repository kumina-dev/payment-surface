import Link from "next/link";

type PaymentSuccessPageProps = {
  searchParams: Promise<{
    session_id?: string;
  }>;
};

export default async function PaymentSuccessPage({ searchParams }: PaymentSuccessPageProps) {
  const { session_id: stripeSessionId } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center px-6 py-12">
      <section className="rounded-3xl border border-green-500/30 bg-green-500/10 p-8 shadow-2xl">
        <p className="text-sm uppercase tracking-[0.28em] text-green-300">Payment received</p>
        <h1 className="mt-4 text-3xl font-semibold text-zinc-50">Checkout completed</h1>
        <p className="mt-4 text-zinc-300">
          Stripe accepted the payment. Local status is finalized by webhook delivery.
        </p>
        {stripeSessionId ? (
          <p className="mt-4 break-all rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-400">
            Stripe session: {stripeSessionId}
          </p>
        ) : null}
        <Link
          href="/dashboard"
          className="mt-8 inline-flex rounded-xl bg-violet-500 px-5 py-3 text-sm font-medium text-white"
        >
          Back to dashboard
        </Link>
      </section>
    </main>
  );
}
