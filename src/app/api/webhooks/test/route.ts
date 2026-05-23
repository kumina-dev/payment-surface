import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const events = await prisma.webhookEvent.findMany({
    orderBy: {
      createdAt: "desc"
    },
    take: 25,
    select: {
      id: true,
      type: true,
      payload: true,
      status: true,
      attempts: true,
      createdAt: true,
      deliveredAt: true
    }
  });

  return NextResponse.json({
    data: events
  });
}
