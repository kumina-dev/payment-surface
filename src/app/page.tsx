import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-16">
      <p className="mb-4 text-sm uppercase tracking-[0.28em] text-zinc-500">Payment Surface</p>
      <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-zinc-50">
        A tiny simulated payment platform.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
        Checkout sessions, fake card authorization, payment intent lifecycle, ledger entries, and
        webhook events. No real money. No fake empire. Tragic restraint, but useful.
      </p>
      <div className="mt-10 flex gap-4">
        <Link
          href="/dashboard"
          className="rounded-xl bg-violet-500 px-5 py-3 text-sm font-medium text-white"
        >
          Dashboard
        </Link>
        <Link
          href="/pay/checkout_demo"
          className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-zinc-100"
        >
          Demo checkout
        </Link>
      </div>
    </main>
  );
}
