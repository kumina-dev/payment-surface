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
  "description": "Minimal fake checkout session.",
  "amountCents": 1999,
  "currency": "EUR"
}
```

```http
GET /api/checkout-sessions/:checkoutSessionId
```

## Payment intents

```http
GET /api/payment-intents
```

```http
POST /api/payment-intents
Content-Type: application/json
Idempotency-Key: checkout_checkout_demo

{
  "merchantId": "merchant_demo",
  "checkoutSessionId": "checkout_demo",
  "amountCents": 1999,
  "currency": "EUR"
}
```

```http
PATCH /api/payment-intents
Content-Type: application/json

{
  "paymentIntentId": "pi_or_cuid",
  "cardNumber": "4242 4242 4242 4242"
}
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
