/*
  Warnings:

  - A unique constraint covering the columns `[stripeCheckoutSessionId]` on the table `CheckoutSession` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripePaymentIntentId]` on the table `PaymentIntent` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "CheckoutSession" ADD COLUMN     "stripeCheckoutSessionId" TEXT,
ADD COLUMN     "stripeCheckoutUrl" TEXT;

-- AlterTable
ALTER TABLE "PaymentIntent" ADD COLUMN     "stripePaymentIntentId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "CheckoutSession_stripeCheckoutSessionId_key" ON "CheckoutSession"("stripeCheckoutSessionId");

-- CreateIndex
CREATE INDEX "CheckoutSession_stripeCheckoutSessionId_idx" ON "CheckoutSession"("stripeCheckoutSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentIntent_stripePaymentIntentId_key" ON "PaymentIntent"("stripePaymentIntentId");

-- CreateIndex
CREATE INDEX "PaymentIntent_stripePaymentIntentId_idx" ON "PaymentIntent"("stripePaymentIntentId");
