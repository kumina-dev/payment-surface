export type AuthContext = {
  merchantId: string;
};

export function getDemoAuthContext(): AuthContext {
  return {
    merchantId: "merchant_demo"
  };
}
