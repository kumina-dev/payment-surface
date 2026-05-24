# cURL

## Create checkout session

```bash
curl -X POST http://localhost:3000/api/checkout-sessions \
  -H "content-type: application/json" \
  -d '{
    "title": "Test Product",
    "description": "Minimal fake checkout session.",
    "amountCents": 1999,
    "currency": "EUR"
  }'
```

## Create payment intent

```bash
curl -X POST http://localhost:3000/api/payment-intents \
  -H "content-type: application/json" \
  -H "idempotency-key: manual_test_001" \
  -d '{
    "merchantId": "merchant_demo",
    "amountCents": 1999,
    "currency": "EUR"
  }'
```

## Confirm payment intent

```bash
curl -X PATCH http://localhost:3000/api/payment-intents \
  -H "content-type: application/json" \
  -d '{
    "paymentIntentId": "PASTE_PAYMENT_INTENT_ID",
    "cardNumber": "4242 4242 4242 4242"
  }'
```

## List ledger entries

```bash
curl http://localhost:3000/api/ledger
```

## Create webhook endpoint

```bash
curl -X POST http://localhost:3000/api/webhook-endpoints \
  -H "content-type: application/json" \
  -d '{
    "url": "https://example.com/webhooks/payment-surface"
  }'
```

## List webhook endpoints

```bash
curl http://localhost:3000/api/webhook-events
```
