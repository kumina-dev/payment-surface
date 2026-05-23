import { CheckoutForm } from "@/app/pay/[checkoutSessionId]/checkout-form";
import {
  findCheckoutSessionById,
  formatMoney
} from "@/modules/checkout-sessions/checkout-sessions.service";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type CheckoutPageProps = {
  params: Promise<{
    checkoutSessionId: string;
  }>;
};

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { checkoutSessionId } = await params;
  const checkoutSession = await findCheckoutSessionById(checkoutSessionId);

  if (checkoutSession === null) {
    notFound();
  }

  const session = checkoutSession;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center px-6 py-12">
      <section className="rounded-3xl border border-white/10 bg-white/4 p-8 shadow-2xl">
        <p className="text-sm uppercase tracking-[0.28em] text-zinc-500">Checkout</p>
        <h1 className="mt-4 text-3xl font-semibold text-zinc-50">{session.title}</h1>
        {session.description ? <p className="mt-3 text-zinc-400">{session.description}</p> : null}

        <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="text-sm text-zinc-500">Amount</p>
          <p className="mt-2 text-4xl font-semibold text-zinc-50">
            {formatMoney(session.amountCents, session.currency)}
          </p>
        </div>

        {session.status === "paid" ? (
          <div className="mt-8 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
            This checkout session is already paid.
          </div>
        ) : (
          <CheckoutForm
            checkoutSessionId={session.id}
            merchantId={session.merchantId}
            amountCents={session.amountCents}
            currency={session.currency}
          />
        )}

        <p className="mt-5 text-sm text-zinc-500">
          Test mode only. Real money is not invited to this disaster.
        </p>
      </section>
    </main>
  );
}
