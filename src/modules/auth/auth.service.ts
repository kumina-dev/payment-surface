export type AuthContext = {
  merchantId: string;
};

export function getAuthContext(): AuthContext {
  const merchantId = process.env.DEFAULT_MERCHANT_ID;

  if (!merchantId) {
    throw new Error("DEFAULT_MERCHANT_ID is required.");
  }

  return {
    merchantId
  };
}
