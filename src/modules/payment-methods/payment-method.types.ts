export type TestCardOutcome =
  | {
      approved: true;
      code: "approved";
    }
  | {
      approved: false;
      code: "declined" | "insufficient_funds" | "invalid_card";
    };
