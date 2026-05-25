import { getAuthContext } from "@/modules/auth/auth.service";
import {
  createWebhookEndpoint,
  listWebhookEndpoints
} from "@/modules/webhooks/webhook-endpoints.service";
import { NextResponse } from "next/server";

export async function GET() {
  const auth = getAuthContext();

  const endpoints = await listWebhookEndpoints({
    merchantId: auth.merchantId
  });

  return NextResponse.json({
    data: endpoints
  });
}

export async function POST(request: Request) {
  const auth = getAuthContext();

  const body = (await request.json()) as {
    url?: unknown;
  };

  if (typeof body.url !== "string") {
    return NextResponse.json({ error: "invalid_webhook_url" }, { status: 400 });
  }

  let url: URL;

  try {
    url = new URL(body.url);
  } catch {
    return NextResponse.json({ error: "invalid_webhook_url" }, { status: 400 });
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    return NextResponse.json({ error: "invalid_webhook_protocol" }, { status: 400 });
  }

  const endpoint = await createWebhookEndpoint({
    merchantId: auth.merchantId,
    url: url.toString()
  });

  return NextResponse.json(
    {
      data: endpoint
    },
    {
      status: 201
    }
  );
}
