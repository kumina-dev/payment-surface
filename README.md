# Payment Surface

Payment Surface is a portfolio project that simulates a small hosted checkout and payment tracking system.

The goal is to build something closer to real payment infrastructure than a simple demo page: checkout session creation, Stripe Checkout redirect flow, webhook handling, local payment state, ledger entries and a dashboard for inspecting payment activity.

This is not a production payment provider. It is a learning and portfolio project focused on full-stack application structure, database modeling and reliable payment-style workflows.

---

## Why this project exists

Most portfolio payment examples stop at “click a button and redirect to Stripe”.

This project goes further by modeling the backend side of the flow:

- creating checkout sessions
- receiving Stripe webhook events
- verifying webhook signatures
- storing local payment state
- tracking payment intent lifecycle
- recording authorization and capture data
- creating ledger entries
- exposing dashboard and API views for inspection

The purpose is to show practical full-stack development skills, not just UI work.

---

## Tech stack

- **Next.js**
- **TypeScript**
- **Prisma 7**
- **PostgreSQL**
- **Tailwind CSS**
- **Stripe Checkout**
- **Stripe CLI**
- **Docker Compose**
- **pnpm**

---

## Current features

- Merchant context from environment configuration
- Hosted checkout session creation
- Stripe Checkout redirect
- Stripe webhook signature verification
- Payment intent lifecycle tracking
- Authorization and capture records
- Ledger entries
- Webhook event records
- Webhook endpoint registration
- Dashboard overview
- Health check endpoint
- Prisma 7 configuration with `prisma.config.ts`
- Local PostgreSQL setup with Docker Compose
- Seed data for local development

---

## What this project demonstrates

### Full-stack application structure

The project includes frontend views, backend API routes, database schema, local development tooling and Stripe integration points.

### Payment workflow thinking

Instead of treating Stripe as only a redirect button, the project models what happens after checkout: webhook events, payment status changes, local records and ledger entries.

### Database modeling

The app uses Prisma and PostgreSQL to persist payment-related data such as checkout sessions, payment intents, webhook events and ledger records.

### Backend integration

The project includes API routes for checkout sessions, Stripe webhook handling, payment intents, ledger data and webhook endpoint management.

### Local development workflow

The project is designed to run locally with pnpm, Docker Compose, Prisma migrations and Stripe CLI webhook forwarding.

---

## Project status

In development.

The core local payment flow is being built and expanded. The current focus is correctness, database structure and making the project understandable as a portfolio piece.

---

## Local setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Create environment file

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

On macOS/Linux:

```bash
cp .env.example .env
```

Then fill in the required Stripe and database values.

### 3. Start the database

```bash
pnpm db:up
```

### 4. Run Prisma migrations

```bash
pnpm prisma:migrate
```

### 5. Seed the database

```bash
pnpm db:seed
```

### 6. Start the development server

```bash
pnpm dev
```

The app should be available at:

```txt
http://localhost:3000
```

---

## Stripe webhook setup for local development

Log in to the Stripe CLI:

```bash
stripe login
```

Forward selected Stripe events to the local webhook endpoint:

```bash
stripe listen --events checkout.session.completed,checkout.session.expired,payment_intent.payment_failed --forward-to localhost:3000/api/stripe/webhooks
```

Copy the generated `whsec_...` value into `.env`:

```env
STRIPE_WEBHOOK_SECRET="whsec_replace_me"
```

---

## Useful commands

```bash
pnpm dev
```

Start the local development server.

```bash
pnpm db:up
```

Start the local PostgreSQL database.

```bash
pnpm prisma:migrate
```

Run database migrations.

```bash
pnpm db:seed
```

Seed local development data.

```bash
pnpm check
```

Run project checks.

```bash
pnpm build
```

Create a production build.

---

## API endpoints

### Health

```txt
GET    /api/health
```

### Checkout sessions

```txt
GET    /api/checkout-sessions
POST   /api/checkout-sessions
GET    /api/checkout-sessions/:checkoutSessionId
```

### Stripe checkout

```txt
POST   /api/stripe/checkout-sessions
```

### Stripe webhooks

```txt
POST   /api/stripe/webhooks
```

### Payment intents

```txt
GET    /api/payment-intents
GET    /api/payment-intents/:paymentIntentId
```

### Ledger

```txt
GET    /api/ledger
```

### Webhook endpoints

```txt
GET    /api/webhook-endpoints
POST   /api/webhook-endpoints
```

### Webhook events

```txt
GET    /api/webhook-events
PATCH  /api/webhook-events/:webhookEventId
```

---

## Planned improvements

- Better dashboard UI for payment and ledger inspection
- More complete checkout session detail views
- Clearer error states
- Stronger validation around API inputs
- Tests for payment and webhook flows
- More complete webhook event replay / handling logic
- Deployment documentation
- Screenshots or demo video
- Architecture notes in `/docs`

---

## Screenshots

Screenshots will be added as the UI becomes more stable.

Suggested screenshots:

- Dashboard overview
- Checkout creation flow
- Payment intent detail view
- Ledger entries
- Webhook event list

---

## Notes

This project uses Stripe in a local development / test-mode context. It should not be used as production payment infrastructure.

The main purpose of the project is to demonstrate full-stack development, integration work, database modeling and payment workflow understanding.

---

## Author

Ville Syrjälä
GitHub: [kumina-dev](https://github.com/kumina-dev)
