import { NextResponse } from "next/server";
import { RATES, DEBT_RATIO } from "@/lib/calc";

export async function GET() {
  return NextResponse.json({
    debtRatio: DEBT_RATIO,
    rates: RATES,
    updatedAt: new Date().toISOString(),
  });
}
