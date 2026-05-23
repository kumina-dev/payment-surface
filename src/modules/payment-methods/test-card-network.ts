import type { TestCardOutcome } from "@/modules/payment-methods/payment-method.types";

const normalizedCardMap: Record<string, TestCardOutcome> = {
  "4242424242424242": {
    approved: true,
    code: "approved"
  },
  "4000000000000002": {
    approved: false,
    code: "declined"
  },
  "4000000000009995": {
    approved: false,
    code: "insufficient_funds"
  }
};

export function authorizeTestCard(cardNumber: string): TestCardOutcome {
  const normalized = cardNumber.replace(/\D/g, "");

  return (
    normalizedCardMap[normalized] ?? {
      approved: false,
      code: "invalid_card"
    }
  );
}
