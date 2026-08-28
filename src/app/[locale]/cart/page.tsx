"use client";

import { useTranslations } from "next-intl";
import { ShoppingBag, Trash2, Minus, Plus, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Link, useRouter } from "@/i18n/navigation";
import { useCart } from "@/lib/store/useCart";
import { useSettings } from "@/lib/store/useSettings";

export default function CartPage() {
  const t = useTranslations("cart");
  const router = useRouter();
  const { items, removeItem, updateQuantity, getSubtotal, getShippingCost } =
    useCart();
  const settings = useSettings();

  const subtotal = getSubtotal();
  const shipping = getShippingCost(
    settings.shipping.freeThreshold,
    settings.shipping.localCost
  );
  const total = subtotal + shipping;
  const remaining = settings.shipping.freeThreshold - subtotal;
  const hasPhysicalItems = items.some((i) => !i.isDigital);

  // Panier vide
  if (items.length === 0) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center sm:py-24">
        <ShoppingBag className="h-20 w-20 text-slate-300 sm:h-24 sm:w-24" />
        <h1 className="mt-6 text-2xl font-black text-slate-900 sm:text-3xl">
          {t("empty")}
        </h1>
        <p className="mt-2 text-sm text-slate-500 sm:mt-3">{t("emptyDesc")}</p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-2 bg-slate-900 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-slate-800 sm:mt-8 sm:px-8 sm:py-4"
        >
          {t("explore")}
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-6 pb-28 sm:px-6 sm:py-10 lg:px-8 lg:pb-12">
      {/* 1. En-tête */}
      <div className="mb-6 space-y-1">
        <p className="block text-xs font-bold uppercase tracking-widest text-brand-600">
          DNK Tech
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {t("title")}
        </h1>
      </div>

      {/* 2. Progression livraison gratuite */}
      {hasPhysicalItems && (
        <div className="mb-6 border border-slate-200 bg-white p-3.5 text-xs shadow-sm sm:p-4 sm:text-sm">
          {remaining > 0 ? (
            <>
              <p className="font-semibold text-slate-700">
                {t("freeShippingProgress", { amount: remaining.toFixed(2) })}
              </p>
              <div className="mt-2 h-2 overflow-hidden bg-slate-100">
                <div
                  className="h-full bg-brand-600 transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      (subtotal / settings.shipping.freeThreshold) * 100
                    )}%`
                  }}
                />
              </div>
            </>
          ) : (
            <p className="flex items-center gap-2 font-semibold text-emerald-700">
              <span>🎉</span>
              <span>{t("freeShippingReached")}</span>
            </p>
          )}
        </div>
      )}

      {/* Grille Principale */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
        {/* 3. Liste des articles */}
        <div className="space-y-4 lg:col-span-8">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.variantId}`}
              className="border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
            >
              <div className="flex gap-4 sm:gap-6">
                {/* Image du produit */}
                <Link
                  href={`/product/${item.productId}`}
                  className="relative h-20 w-20 shrink-0 overflow-hidden border border-slate-100 bg-slate-100 sm:h-28 sm:w-28"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 80px, 112px"
                  />
                  {item.isDigital && (
                    <span className="absolute left-1 top-1 bg-brand-600 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
                      {t("digital")}
                    </span>
                  )}
                </Link>

                {/* Infos & Actions du produit */}
                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/product/${item.productId}`}
                        className="truncate text-base font-bold text-slate-900 hover:text-brand-600 sm:text-lg"
                      >
                        {item.name}
                      </Link>

                      <button
                        onClick={() =>
                          removeItem(item.productId, item.variantId)
                        }
                        className="flex shrink-0 items-center gap-1 p-1 text-xs font-semibold text-red-500 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="hidden sm:inline">{t("remove")}</span>
                      </button>
                    </div>

                    <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
                      {item.variantName}
                      {item.isDigital && (
                        <span className="ml-1 text-brand-600">
                          · 💻 {t("digitalNote")}
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Prix et Sélecteur de quantité */}
                  <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
                    <span className="text-base font-extrabold text-slate-900 sm:text-xl">
                      {item.price} $
                    </span>

                    <div className="shadow-xs flex items-center overflow-hidden border border-slate-300 bg-white">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.variantId,
                            item.quantity - 1
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center font-bold text-slate-600 transition hover:bg-slate-100 active:bg-slate-200 sm:h-9 sm:w-9"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>

                      <span className="w-8 text-center text-xs font-bold text-slate-800 sm:w-10 sm:text-sm">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.variantId,
                            item.quantity + 1
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center font-bold text-slate-600 transition hover:bg-slate-100 active:bg-slate-200 sm:h-9 sm:w-9"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 4. Bloc "Summary" */}
        <div className="lg:col-span-4">
          <aside className="space-y-5 border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-xl font-extrabold text-slate-900">
              {t("summary")}
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>{t("subtotal")}</span>
                <span className="font-bold text-slate-800">
                  {subtotal.toFixed(2)} $
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>{t("shipping")}</span>
                <span className="font-bold text-slate-800">
                  {shipping === 0 ? t("free") : `${shipping.toFixed(2)} $`}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base font-bold text-slate-900">
                <span>{t("total")}</span>
                <span className="text-xl font-black text-slate-900">
                  {total.toFixed(2)} $
                </span>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => router.push("/checkout")}
                className="flex w-full items-center justify-center gap-2 bg-slate-900 px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-slate-800 sm:text-sm"
              >
                <span>{t("checkout")}</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <Link
                href="/shop"
                className="block w-full border border-slate-300 bg-white px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-700 transition hover:bg-slate-50 sm:text-sm"
              >
                {t("continue")}
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* Barre Sticky Checkout Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-4 border-t border-slate-200 bg-white p-3.5 shadow-2xl lg:hidden">
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {t("total")}
          </span>
          <span className="text-lg font-black text-slate-900">
            {total.toFixed(2)} $
          </span>
        </div>
        <button
          onClick={() => router.push("/checkout")}
          className="flex flex-1 items-center justify-center gap-2 bg-slate-900 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition active:scale-[0.98]"
        >
          <span>{t("checkout")}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
