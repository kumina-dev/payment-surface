import { prisma } from "@/lib/prisma";
import type { MerchantSummary } from "@/modules/merchants/merchant.types";

export async function findMerchantSummaryById(id: string): Promise<MerchantSummary> {
  const merchant = await prisma.merchant.findUniqueOrThrow({
    where: {
      id
    },
    select: {
      id: true,
      name: true
    }
  });

  return merchant;
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
