import { createMerchant, listMerchants } from "@/modules/merchants/merchants.service";
import { NextResponse } from "next/server";

export async function GET() {
  const merchants = await listMerchants();

  return NextResponse.json({
    data: merchants
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: unknown;
  };

  if (typeof body.name !== "string" || body.name.trim().length < 2) {
    return NextResponse.json(
      {
        error: "invalid_merchant_name"
      },
      {
        status: 400
      }
    );
  }

  const merchant = await createMerchant({
    name: body.name.trim()
  });

  return NextResponse.json(
    {
      data: merchant
    },
    {
      status: 201
    }
  );
}
