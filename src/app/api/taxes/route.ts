import { NextResponse } from "next/server";
import taxRules from "@/data/taxes.json";
import type { TaxCalculation } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subtotal, shipping, country, province } = body;

    const taxableAmount = subtotal + shipping;

    // Trouver la règle correspondante
    const rule = taxRules.rules.find(
      (r) =>
        r.country === country &&
        (r.province === "Any" || r.province === province)
    );

    let taxes: TaxCalculation["taxes"] = [];
    let taxTotal = 0;
    const matchedRules: string[] = [];

    if (rule) {
      taxes = rule.taxes.map((t) => {
        const amount = parseFloat((taxableAmount * t.rate).toFixed(2));
        taxTotal += amount;
        matchedRules.push(t.ruleId);
        return { ...t, amount };
      });
    }

    const grandTotal = parseFloat((taxableAmount + taxTotal).toFixed(2));

    const response: TaxCalculation = {
      subtotal,
      shipping,
      taxes,
      taxTotal: parseFloat(taxTotal.toFixed(2)),
      grandTotal,
      auditRecord: {
        calculationId: `CALC-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        timestamp: new Date().toISOString(),
        destination: `${province}, ${country}`,
        matchedRules
      }
    };

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: "Failed to calculate taxes" },
      { status: 500 }
    );
  }
}
