"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useCart } from "@/lib/store/useCart";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import { ShoppingBag } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const router = useRouter();
  const { items } = useCart();

  // Redirige si le panier est vide
  useEffect(() => {
    if (items.length === 0) {
      router.replace("/cart");
    }
  }, [items.length, router]);

  if (items.length === 0) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center sm:py-24">
        <ShoppingBag className="h-20 w-20 text-slate-300 sm:h-24 sm:w-24" />
        <h1 className="mt-6 text-2xl font-black text-slate-900 sm:text-3xl">
          Votre panier est vide
        </h1>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-2 bg-brand-600 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-brand-700 sm:mt-8 sm:px-8 sm:py-4"
        >
          Explorer la boutique →
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
      {/* Titre */}
      <div className="mb-8 sm:mb-10">
        <p className="text-xs font-bold uppercase tracking-[.25em] text-brand-600">
          {t("subtitle")}
        </p>
        <h1 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
          {t("title")}
        </h1>
      </div>

      {/* Grille : Formulaire + Résumé */}
      <div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr] lg:gap-12">
        <CheckoutForm />
        <OrderSummary />
      </div>
    </section>
  );
}
