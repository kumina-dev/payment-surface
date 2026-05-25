import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required.`);
  }

  return value;
}

const connectionString = getRequiredEnv("DATABASE_URL");
const defaultMerchantId = getRequiredEnv("DEFAULT_MERCHANT_ID");
const defaultMerchantName = getRequiredEnv("DEFAULT_MERCHANT_NAME");

const adapter = new PrismaPg({
  connectionString
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.merchant.upsert({
    where: {
      id: defaultMerchantId
    },
    update: {
      name: defaultMerchantName
    },
    create: {
      id: defaultMerchantId,
      name: defaultMerchantName
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
