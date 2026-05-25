# API

## Health

```http
GET /api/health
```

## Checkout sessions

```http
GET /api/checkout-sessions
```

```http
POST /api/checkout-sessions
Content-Type: application/json

{
  "title": "Test Product",
  "description": "Stripe Checkout payment session.",
  "amountCents": 1999,
  "currency": "EUR"
}
```

```http
GET /api/checkout-sessions/:checkoutSessionId
```

## Stripe Checkout

```http
POST /api/stripe/checkout-sessions
Content-Type: application/json

{
  "checkoutSessionId": "checkout_session_id"
}
```

## Stripe webhook

```http
POST /api/stripe/webhooks
Stripe-Signature: t=timestamp,v1=signature
```

## Payment intents

```http
GET /api/payment-intents
```

```http
GET /api/payment-intents/:paymentIntentId
```

## Ledger

```http
GET /api/ledger
```

## Webhook endpoints

```http
GET /api/webhook-endpoints
```

```http
POST /api/webhook-endpoints
Content-Type: application/json

{
  "url": "https://example.com/webhooks/payment-surface"
}
```

## Webhook events

```http
GET /api/webhook-events
```

```http
PATCH /api/webhook-events/:webhookEventId
Content-Type: application/json

{
  "status": "delivered"
}
```

```http
PATCH /api/webhook-events/:webhookEventId
Content-Type: application/json

{
  "status": "failed"
}
```
