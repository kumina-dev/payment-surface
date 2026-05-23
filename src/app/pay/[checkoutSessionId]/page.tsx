import { formatMoney, getDemoCheckoutSession } from "@/modules/checkout-sessions/checkout-sessions.service";
import { notFound } from "next/navigation";

type CheckoutPageProps = {
  params: Promise<{
    checkoutSessionId: string;
  }>;
};

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { checkoutSessionId } = await params;
  const checkoutSession = getDemoCheckoutSession();

  if (checkoutSessionId !== checkoutSession.id) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center px-6 py-12">
      <section className="rounded-3xl border border-white/10 bg-white/4 p-8 shadow-2xl">
        <p className="text-sm uppercase tracking-[0.28em] text-zinc-500">Checkout</p>
        <h1 className="mt-4 text-3xl font-semibold text-zinc-50">{checkoutSession.title}</h1>
        {checkoutSession.description ? (
          <p className="mt-3 text-zinc-400">{checkoutSession.description}</p>
        ) : null}

        <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="text-sm text-zinc-500">Amount</p>
          <p className="mt-2 text-4xl font-semibold text-zinc-50">
            {formatMoney(checkoutSession.amountCents, checkoutSession.currency)}
          </p>
        </div>

        <form className="mt-8 space-y-4">
          <label className="block">
            <span className="text-sm text-zinc-400">Test card</span>
            <input
              name="cardNumber"
              defaultValue="4242 4242 4242 4242"
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-zinc-50 outline-none"
            />
          </label>
          <button
            type="button"
            className="w-full rounded-xl bg-violet-500 px-5 py-3 text-sm font-medium text-white"
          >
            Pay in test mode
          </button>
        </form>

        <p className="mt-5 text-sm text-zinc-500">
          Test mode only. Real money is not invited to this disaster.
        </p>
      </section>
    </main>
  );
}
