# cURL

## Create checkout session

```powershell
Invoke-RestMethod `
  -Uri "http://localhost:3000/api/checkout-sessions" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{
    "title": "Test Product",
    "description": "Stripe Checkout payment session.",
    "amountCents": 1999,
    "currency": "EUR"
  }'
```

## Create Stripe Checkout session

```powershell
Invoke-RestMethod `
  -Uri "http://localhost:3000/api/stripe/checkout-sessions" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{
    "checkoutSessionId": "PASTE_CHECKOUT_SESSION_ID"
  }'
```

## List payment intents

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/payment-intents"
```

## List ledger entries

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/ledger"
```

## Create webhook endpoint

```powershell
Invoke-RestMethod `
  -Uri "http://localhost:3000/api/webhook-endpoints" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{
    "url": "https://example.com/webhooks/payment-surface"
  }'
```

## List webhook endpoints

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/webhook-events"
```

## Listen to Stripe webhooks locally

```powershell
stripe listen --events checkout.session.completed,checkout.session.expired,payment_intent.payment_failed --forward-to localhost:3000/api/stripe/webhooks
```
