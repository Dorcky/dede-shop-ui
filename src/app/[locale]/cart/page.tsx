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
          className="mt-6 inline-flex items-center gap-2 bg-slate-900 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-brand-700 sm:mt-8 sm:px-8 sm:py-4"
        >
          {t("explore")}
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
      {/* Titre */}
      <div className="mb-8 sm:mb-10">
        <p className="text-xs font-bold uppercase tracking-[.25em] text-brand-600">
          DNK Tech
        </p>
        <h1 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
          {t("title")}
        </h1>
      </div>

      {/* Progression livraison gratuite */}
      {hasPhysicalItems && (
        <div className="mb-6 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:mb-8 sm:p-5">
          {remaining > 0 ? (
            <>
              <p className="text-sm font-semibold text-slate-700">
                {t("freeShippingProgress", { amount: remaining.toFixed(0) })}
              </p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full bg-brand-600 transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (subtotal / settings.shipping.freeThreshold) * 100)}%`
                  }}
                />
              </div>
            </>
          ) : (
            <p className="text-sm font-bold text-green-700">
              {t("freeShippingReached")}
            </p>
          )}
        </div>
      )}

      {/* Grille : Liste + Résumé */}
      <div className="grid gap-8 lg:grid-cols-[1.4fr_.6fr] lg:gap-12">
        {/* Liste des articles */}
        <div className="divide-y divide-slate-200">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.variantId}`}
              className="flex gap-3 py-5 sm:gap-5 sm:py-6"
            >
              <Link
                href={`/product/${item.productId}`}
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded bg-slate-100 sm:h-32 sm:w-32 lg:h-36 lg:w-36"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 96px, 144px"
                />
                {item.isDigital && (
                  <span className="absolute left-1 top-1 rounded bg-brand-600 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
                    {t("digital")}
                  </span>
                )}
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                  <div className="min-w-0">
                    <Link
                      href={`/product/${item.productId}`}
                      className="text-base font-bold text-slate-900 hover:text-brand-600 sm:text-lg"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-0.5 text-sm text-slate-500 sm:mt-1">
                      {item.variantName}
                      {item.isDigital && (
                        <span className="ml-1 text-brand-600">
                          · 💻 {t("digitalNote")}
                        </span>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId, item.variantId)}
                    className="flex items-center gap-1 text-left text-sm font-semibold text-red-600 transition hover:text-red-700 sm:text-right"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>{t("remove")}</span>
                  </button>
                </div>
                <p className="mt-2 text-base font-black text-slate-900 sm:mt-3 sm:text-lg">
                  {item.price} $
                </p>
                <div className="mt-2 flex w-max items-center border border-slate-300 sm:mt-3">
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.productId,
                        item.variantId,
                        item.quantity - 1
                      )
                    }
                    className="px-3 py-1.5 text-slate-600 transition hover:bg-slate-100 sm:px-4 sm:py-2"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="min-w-8 px-3 text-center text-sm font-bold sm:min-w-10 sm:px-4">
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
                    className="px-3 py-1.5 text-slate-600 transition hover:bg-slate-100 sm:px-4 sm:py-2"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Résumé */}
        <aside className="h-max bg-white p-5 sm:p-6">
          <h2 className="text-xl font-black text-slate-900">{t("summary")}</h2>
          <div className="mt-4 space-y-3 text-sm sm:mt-6">
            <div className="flex justify-between">
              <span className="text-slate-600">{t("subtotal")}</span>
              <span className="font-bold text-slate-900">
                {subtotal.toFixed(2)} $
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">{t("shipping")}</span>
              <span className="font-bold text-slate-900">
                {shipping === 0 ? t("free") : `${shipping.toFixed(2)} $`}
              </span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-3 text-lg font-black text-slate-900">
              <span>{t("total")}</span>
              <span>{total.toFixed(2)} $</span>
            </div>
          </div>
          <button
            onClick={() => router.push("/checkout")}
            className="mt-5 flex w-full items-center justify-center gap-2 bg-slate-900 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-brand-700 sm:mt-7 sm:py-4"
          >
            {t("checkout")}
            <ArrowRight className="h-4 w-4" />
          </button>
          <Link
            href="/shop"
            className="mt-3 block w-full border border-slate-300 py-2.5 text-center text-xs font-bold uppercase tracking-wider text-slate-900 transition hover:border-slate-900 sm:py-3"
          >
            {t("continue")}
          </Link>
        </aside>
      </div>
    </section>
  );
}
