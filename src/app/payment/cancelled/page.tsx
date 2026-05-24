import Link from "next/link";

export default function PaymentCancelledPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center px-6 py-12">
      <section className="rounded-3xl border border-white/10 bg-white/4 p-8 shadow-2xl">
        <p className="text-sm uppercase tracking-[0.28em] text-zinc-500">Payment cancelled</p>
        <h1 className="mt-4 text-3xl font-semibold text-zinc-50">Checkout was not completed</h1>
        <p className="mt-4 text-zinc-400">No payment was recorded.</p>
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
