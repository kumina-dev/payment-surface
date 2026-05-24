# Payment Surface

Minimal simulated payment platform built with Next.js, TypeScript, Prisma, PostgreSQL, and Tailwind.

## Scope

Payment Surface is a portfolio project. It simulates payment-platform primitives without processing real money.

## Features

- Merchant demo context
- Checkout session creation
- Hosted checkout page
- Test card authorization
- Payment intent lifecycle
- Authorization and capture records
- Immutable ledger entries
- Webhook event records
- Webhook endpoint registration
- Dashboard overview
- Prisma 7 config with `prisma.config.ts`

## Test cards

| Card number | Result |
| --- | --- |
| `4242 4242 4242 4242` | Success |
| `4000 0000 0000 0002` | Declined |
| `4000 0000 0000 9995` | Insufficient funds |

## Setup

```bash
pnpm install
cp .env.example .env
docker compose up -d
pnpm prisma:migrate
pnpm db:seed
pnpm dev
```

## Verify

```bash
pnpm check
pnpm build
```

## Useful endpoints

```txt
GET    /api/health
GET    /api/checkout-sessions
POST   /api/checkout-sessions
GET    /api/payment-intents
POST   /api/payment-intents
PATCH  /api/payment-intents
GET    /api/payment-intents/:paymentIntentId
GET    /api/ledger
GET    /api/webhook-endpoints
POST   /api/webhook-endpoints
GET    /api/webhook-events
PATCH  /api/webhook-events/:webhookEventId
GET    /api/webhooks/test
```
