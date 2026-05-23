import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const merchant = await prisma.merchant.upsert({
    where: { id: "merchant_demo" },
    update: {},
    create: {
      id: "merchant_demo",
      name: "Demo Merchant"
    }
  });

  await prisma.checkoutSession.upsert({
    where: { id: "checkout_demo" },
    update: {},
    create: {
      id: "checkout_demo",
      merchantId: merchant.id,
      title: "Demo Checkout",
      description: "A fake payment flow. Because real card networks are not a weekend toy.",
      amountCents: 1999,
      currency: "EUR"
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
