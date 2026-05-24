import { getDemoAuthContext } from "@/modules/auth/auth.service";
import { listLedgerEntries } from "@/modules/ledger/ledger.service";
import { NextResponse } from "next/server";

export async function GET() {
  const auth = getDemoAuthContext();

  const ledgerEntries = await listLedgerEntries({
    merchantId: auth.merchantId
  });

  return NextResponse.json({
    data: ledgerEntries
  });
}
