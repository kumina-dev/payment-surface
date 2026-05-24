# Architecture

## Project shape

```txt
src/
  app/
    api/
    dashboard/
    pay/
  components/
    checkout/
    dashboard/
  lib/
  modules/
    auth/
    checkout-sessions/
    ledger/
    merchants/
    payment-methods/
    payment-intents/
    webhooks/
  styles/
```

## Core flow

```txt
CheckoutSession
  -> PaymentIntent
  -> Authorization
  -> Capture
  -> LedgerEntry
  -> WebhookEvent
```

## Payment simulation

The app does not process real payments.

The test card network maps known card numbers to deterministic authorization outcomes.

## Current auth model

The app uses a fixed demo merchant context:

```txt
merchant_demo
```

This keeps the foundation small while preserving the boundary where real auth can be added later.

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
- No real card processing
- No card storage
- No payouts
- No subscriptions
- No PCI scope
- No real webhook delivery yet
- No Redis usage yet
