"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useCart } from "@/lib/store/useCart";
import type { TaxCalculation } from "@/types";

interface OrderSummaryProps {
  taxData: TaxCalculation | null;
}

export default function OrderSummary({ taxData }: OrderSummaryProps) {
  const t = useTranslations("checkout");
  const tCart = useTranslations("cart");
  const { items, getSubtotal } = useCart();
  const subtotal = getSubtotal();

  // Fallback si les taxes ne sont pas encore calculées
  const displayTaxData = taxData || {
    subtotal,
    shipping: 0,
    taxes: [],
    taxTotal: 0,
    grandTotal: subtotal,
    auditRecord: {
      calculationId: "PENDING",
      timestamp: "",
      destination: "",
      matchedRules: []
    }
  };

  return (
    <aside className="space-y-6">
      {/* Carte de résumé */}
      <div className="border border-slate-300 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="border-b border-slate-200 pb-3 text-lg font-black uppercase text-slate-900">
          {t("yourOrder")}
        </h2>

        <div className="mt-4 space-y-4 sm:mt-6 sm:space-y-5">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.variantId}`}
              className="flex gap-3"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden bg-slate-100 sm:h-16 sm:w-16">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-bold text-slate-900">
                  {item.name}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {item.variantName} · Qté {item.quantity}
                  {item.isDigital && " 💻"}
                </p>
              </div>
              <p className="shrink-0 text-sm font-bold text-slate-900">
                {(item.price * item.quantity).toFixed(2)} $
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 space-y-2 border-t border-slate-200 pt-4 text-sm sm:mt-7 sm:space-y-3 sm:pt-5">
          <div className="flex justify-between text-slate-600">
            <span>{tCart("subtotal")}</span>
            <span className="font-mono font-semibold">
              {displayTaxData.subtotal.toFixed(2)} $
            </span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>{tCart("shipping")}</span>
            <span className="text-xs font-semibold uppercase text-emerald-600">
              {displayTaxData.shipping === 0
                ? tCart("free")
                : `${displayTaxData.shipping.toFixed(2)} $`}
            </span>
          </div>
        </div>

        {/* Lignes de taxes dynamiques */}
        <div className="my-3 space-y-1.5 border-b border-t border-dashed border-slate-300 py-3">
          <span className="mb-1 block text-[11px] font-bold uppercase text-slate-500">
            Détail des Taxes Applicables
          </span>
          <div className="space-y-1 font-mono text-xs">
            {displayTaxData.taxes.length > 0 ? (
              displayTaxData.taxes.map((tax, i) => (
                <div
                  key={i}
                  className="flex justify-between font-semibold text-slate-800"
                >
                  <span>
                    {tax.type} (
                    {(tax.rate * 100).toFixed(tax.rate < 0.1 ? 3 : 0)}%)
                  </span>
                  <span>+{tax.amount.toFixed(2)} $</span>
                </div>
              ))
            ) : (
              <span className="italic text-slate-400">Calcul en cours...</span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm font-bold">
          <span>Total des taxes</span>
          <span className="font-mono text-sky-700">
            {displayTaxData.taxTotal.toFixed(2)} $
          </span>
        </div>

        <div className="flex items-end justify-between border-t-2 border-slate-900 pt-3">
          <div>
            <span className="block text-xs font-bold uppercase text-slate-500">
              Montant Total TTC
            </span>
            <span className="font-mono text-2xl font-black text-slate-900">
              {displayTaxData.grandTotal.toFixed(2)} $
            </span>
          </div>
        </div>
      </div>

      {/* ✅ Le terminal d'audit "Tax Engine v2.4" a été complètement supprimé */}
    </aside>
  );
}
