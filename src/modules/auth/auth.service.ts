// WILL EXPAND: replace demo merchant context with Better Auth or custom auth.

export type AuthContext = {
  merchantId: string;
};

export function getDemoAuthContext(): AuthContext {
  return {
    merchantId: "merchant_demo"
  };
}
