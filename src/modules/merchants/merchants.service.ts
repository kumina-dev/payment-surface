import type { MerchantSummary } from "@/modules/merchants/merchant.types";

export function getDemoMerchant(): MerchantSummary {
  return {
    id: "merchant_demo",
    name: "Demo Merchant"
  };
}
