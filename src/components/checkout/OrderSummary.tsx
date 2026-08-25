"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useCart } from "@/lib/store/useCart";
import { useSettings } from "@/lib/store/useSettings";

export default function OrderSummary() {
  const t = useTranslations("checkout");
  const tCart = useTranslations("cart");
  const { items, getSubtotal, getShippingCost } = useCart();
  const settings = useSettings();

  const subtotal = getSubtotal();
  const shipping = getShippingCost(
    settings.shipping.freeThreshold,
    settings.shipping.localCost
  );
  const total = subtotal + shipping;

  return (
    <aside className="h-max rounded-lg border border-slate-200 bg-white p-5 sm:p-6">
      <h2 className="text-xl font-black text-slate-900">{t("yourOrder")}</h2>

      {/* Liste des articles */}
      <div className="mt-4 space-y-4 sm:mt-6 sm:space-y-5">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.variantId}`}
            className="flex gap-3"
          >
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded bg-slate-100 sm:h-16 sm:w-16">
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

      {/* Résumé des prix */}
      <div className="mt-5 space-y-2 border-t border-slate-200 pt-4 text-sm sm:mt-7 sm:space-y-3 sm:pt-5">
        <div className="flex justify-between">
          <span className="text-slate-600">{tCart("subtotal")}</span>
          <span className="font-bold text-slate-900">
            {subtotal.toFixed(2)} $
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">{tCart("shipping")}</span>
          <span className="font-bold text-slate-900">
            {shipping === 0 ? tCart("free") : `${shipping.toFixed(2)} $`}
          </span>
        </div>
        <div className="flex justify-between border-t border-slate-200 pt-3 text-lg font-black text-slate-900">
          <span>{tCart("total")}</span>
          <span>{total.toFixed(2)} $</span>
        </div>
      </div>
    </aside>
  );
}
