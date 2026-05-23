import { prisma } from "@/lib/prisma";
import type { MerchantSummary } from "@/modules/merchants/merchant.types";

export function getDemoMerchant(): MerchantSummary {
  return {
    id: "merchant_demo",
    name: "Demo Merchant"
  };
}

export async function listMerchants(): Promise<MerchantSummary[]> {
  const merchants = await prisma.merchant.findMany({
    orderBy: {
      createdAt: "desc"
    },
    select: {
      id: true,
      name: true
    }
  });

  return merchants;
}

export async function createMerchant(input: { name: string }): Promise<MerchantSummary> {
  const merchant = await prisma.merchant.create({
    data: {
      name: input.name
    },
    select: {
      id: true,
      name: true
    }
  });

  return merchant;
}
