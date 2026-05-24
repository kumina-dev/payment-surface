import { prisma } from "@/lib/prisma";
import type { WebhookEndpointSummary } from "./webhook.types";

export async function listWebhookEndpoints(input: {
  merchantId: string;
}): Promise<WebhookEndpointSummary[]> {
  const endpoints = await prisma.webhookEndpoint.findMany({
    where: {
      merchantId: input.merchantId
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return endpoints.map(mapWebhookEndpoint);
}

export async function createWebhookEndpoint(input: {
  merchantId: string;
  url: string;
}): Promise<WebhookEndpointSummary> {
  const endpoint = await prisma.webhookEndpoint.create({
    data: {
      merchantId: input.merchantId,
      url: input.url,
      secret: `whsec_${crypto.randomUUID().replaceAll("-", "")}`
    }
  });

  return mapWebhookEndpoint(endpoint);
}

function mapWebhookEndpoint(endpoint: {
  id: string;
  merchantId: string;
  url: string;
  enabled: boolean;
  createdAt: Date;
}): WebhookEndpointSummary {
  return {
    id: endpoint.id,
    merchantId: endpoint.merchantId,
    url: endpoint.url,
    enabled: endpoint.enabled,
    createdAt: endpoint.createdAt.toISOString()
  };
}
