# Architecture

## Project shape

```txt
src/
  app/
    api/
    dashboard/
    pay/
    payment/
  components/
    checkout/
    dashboard/
  lib/
  modules/
    auth/
    checkout-sessions/
    ledger/
    merchants/
    payment-intents/
    stripe/
    webhooks/
  styles/
```

## Core flow

```txt
CheckoutSession
  -> Stripe Checkout Session
  -> Stripe webhook
  -> PaymentIntent
  -> Authorization
  -> Capture
  -> LedgerEntry
  -> WebhookEvent
```

## Payment processing

Stripe Checkout is the payment service provider.

The application stores local payment state and listens for Stripe webhook events to finalize successful or failed payments.

## Current auth model

The app uses `DEFAULT_MERCHANT_ID` from environment configuration.

## Database

Prisma 7 uses:

```txt
prisma.config.ts
prisma/schema.prisma
```

The generated Prisma client is written to:

```txt
src/generated/prisma
```

## Intentional limitations
- No card storage
- No payouts
- No subscriptions
- No PCI card handling
- No multi-tenant auth yet
