"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useCart } from "@/lib/store/useCart";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import { ShoppingBag, ChevronDown } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { TaxCalculation } from "@/types";

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const router = useRouter();
  const { items, getSubtotal } = useCart();
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [taxData, setTaxData] = useState<TaxCalculation | null>(null);

  const subtotal = getSubtotal();

  useEffect(() => {
    if (items.length === 0) router.replace("/cart");
  }, [items.length, router]);

  if (items.length === 0) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center sm:py-24">
        <ShoppingBag className="h-20 w-20 text-slate-300 sm:h-24 sm:w-24" />
        <h1 className="mt-6 text-2xl font-black text-slate-900 sm:text-3xl">
          {t("emptyCartTitle")} {/* ✅ TRADUIT */}
        </h1>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-2 bg-brand-600 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-brand-700 sm:mt-8 sm:px-8 sm:py-4"
        >
          {t("exploreShop")} {/* ✅ TRADUIT */}
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-12">
      <div className="mb-6 sm:mb-8">
        <p className="text-xs font-bold uppercase tracking-[.25em] text-brand-600">
          {t("subtitle")}
        </p>
        <h1 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl lg:text-4xl">
          {t("title")}
        </h1>
      </div>

      {/* Résumé mobile (Accordéon) */}
      <div className="mb-6 lg:hidden">
        <details
          className="group rounded-none border border-slate-200 bg-white"
          open={isSummaryOpen}
          onToggle={(e) =>
            setIsSummaryOpen((e.target as HTMLDetailsElement).open)
          }
        >
          <summary className="flex cursor-pointer list-none items-center justify-between p-4 font-bold text-slate-900">
            <span>{t("orderSummary")}</span> {/* ✅ TRADUIT */}
            <div className="flex items-center gap-3">
              <span className="text-brand-600">
                {taxData ? taxData.grandTotal.toFixed(2) : subtotal.toFixed(2)}{" "}
                $
              </span>
              <ChevronDown className="h-5 w-5 transition-transform duration-200 group-open:rotate-180" />
            </div>
          </summary>
          <div className="border-t border-slate-200 p-4">
            <OrderSummary taxData={taxData} />
          </div>
        </details>
      </div>

      {/* Grille Desktop */}
      <div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr] lg:gap-12">
        {/* Le formulaire notifie la page quand les taxes changent */}
        <CheckoutForm onTaxCalculated={setTaxData} />
        <div className="hidden lg:block">
          <OrderSummary taxData={taxData} />
        </div>
      </div>
    </section>
  );
}
