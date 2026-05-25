# Payment Surface

Minimal Stripe Checkout payment surface built with Next.js, TypeScript, Prisma, PostgreSQL, and Tailwind.

## Scope

Payment Surface is a portfolio project for hosted checkout creation, Stripe webhook handling, local payment state, and ledger tracking.

## Features

- Merchant context from environment configuration
- Checkout session creation
- Stripe Checkout redirect
- Stripe webhook signature verification
- Payment intent lifecycle
- Authorization and capture records
- Ledger entries
- Webhook event records
- Webhook endpoint registration
- Dashboard overview
- Prisma 7 config with `prisma.config.ts`

## Setup

```powershell
pnpm install
Copy-Item .env.example .env
pnpm db:up
pnpm prisma:migrate
pnpm db:seed
pnpm dev
```

## Stripe webhook for local development

```powershell
stripe login
stripe listen --events checkout.session.completed,checkout.session.expired,payment_intent.payment_failed --forward-to localhost:3000/api/stripe/webhooks
```

Copy the `whsec_...` value from Stripe CLI into `.env` as:

```env
STRIPE_WEBHOOK_SECRET="whsec_replace_me"
```

## Verify

```powershell
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
GET    /api/payment-intents/:paymentIntentId
POST   /api/stripe/checkout-sessions
POST   /api/stripe/webhooks
GET    /api/ledger
GET    /api/webhook-endpoints
POST   /api/webhook-endpoints
GET    /api/webhook-events
PATCH  /api/webhook-events/:webhookEventId
```
