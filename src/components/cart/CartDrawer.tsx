"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { X, ShoppingBag, Trash2, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { Link, useRouter } from "@/i18n/navigation";
import { useCart } from "@/lib/store/useCart";
import { useSettings } from "@/lib/store/useSettings";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const t = useTranslations("cart");
  const router = useRouter();
  const {
    items,
    removeItem,
    updateQuantity,
    getItemCount,
    getSubtotal,
    getShippingCost
  } = useCart();
  const settings = useSettings();

  const subtotal = getSubtotal();
  const shipping = getShippingCost(
    settings.shipping.freeThreshold,
    settings.shipping.localCost
  );
  const itemCount = getItemCount();
  const remaining = settings.shipping.freeThreshold - subtotal;

  // Verrouille le scroll du body quand le drawer est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleCheckout = () => {
    onClose();
    router.push("/checkout");
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[9998] bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className="animate-in slide-in-from-right fixed right-0 top-0 z-[9999] flex h-full w-full max-w-md flex-col bg-white shadow-2xl duration-300"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6 sm:py-5">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-brand-600" />
            <h2 className="text-lg font-black text-slate-900 sm:text-xl">
              {t("title")}
            </h2>
            {itemCount > 0 && (
              <span className="rounded-full bg-brand-600 px-2 py-0.5 text-xs font-bold text-white">
                {itemCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progression livraison gratuite */}
        {items.length > 0 && !items.every((i) => i.isDigital) && (
          <div className="border-b border-slate-200 bg-slate-50 px-5 py-3 sm:px-6">
            {remaining > 0 ? (
              <>
                <p className="text-xs font-semibold text-slate-700">
                  {t("freeShippingProgress", { amount: remaining.toFixed(0) })}
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full bg-brand-600 transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (subtotal / settings.shipping.freeThreshold) * 100)}%`
                    }}
                  />
                </div>
              </>
            ) : (
              <p className="text-xs font-bold text-green-700">
                {t("freeShippingReached")}
              </p>
            )}
          </div>
        )}

        {/* Contenu */}
        <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-16 text-center">
              <ShoppingBag className="h-16 w-16 text-slate-300" />
              <p className="mt-4 text-lg font-bold text-slate-900">
                {t("empty")}
              </p>
              <p className="mt-1 text-sm text-slate-500">{t("emptyDesc")}</p>
              <Link
                href="/shop"
                onClick={onClose}
                className="mt-5 text-sm font-bold text-brand-600 hover:underline"
              >
                {t("explore")}
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  className="flex gap-3 py-4 sm:gap-4"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded bg-slate-100 sm:h-24 sm:w-24">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                    {item.isDigital && (
                      <span className="absolute left-1 top-1 rounded bg-brand-600 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
                        {t("digital")}
                      </span>
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link
                      href={`/product/${item.productId}`}
                      onClick={onClose}
                      className="line-clamp-2 text-sm font-bold text-slate-900 hover:text-brand-600"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {item.variantName}
                      {item.isDigital && (
                        <span className="ml-1 text-brand-600">
                          · 💻 {t("digitalNote")}
                        </span>
                      )}
                    </p>
                    <p className="mt-1.5 text-sm font-black text-slate-900">
                      {item.price} $
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center border border-slate-300">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.variantId,
                              item.quantity - 1
                            )
                          }
                          className="p-1.5 text-slate-600 transition hover:bg-slate-100 sm:p-2"
                          aria-label="Diminuer"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="min-w-8 px-2 text-center text-xs font-bold sm:min-w-10 sm:text-sm">
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
                          className="p-1.5 text-slate-600 transition hover:bg-slate-100 sm:p-2"
                          aria-label="Augmenter"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        onClick={() =>
                          removeItem(item.productId, item.variantId)
                        }
                        className="flex items-center gap-1 text-xs font-semibold text-red-600 transition hover:text-red-700"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">{t("remove")}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer (résumé + actions) */}
        {items.length > 0 && (
          <div className="border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-6 sm:py-5">
            <div className="space-y-2 text-sm">
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
              <div className="flex justify-between border-t border-slate-300 pt-2 text-base font-black text-slate-900">
                <span>{t("total")}</span>
                <span>{(subtotal + shipping).toFixed(2)} $</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="mt-4 w-full bg-slate-900 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-brand-700 sm:py-4"
            >
              {t("checkout")}
            </button>
            <Link
              href="/cart"
              onClick={onClose}
              className="mt-2 block w-full border border-slate-300 py-2.5 text-center text-xs font-bold uppercase tracking-wider text-slate-900 transition hover:border-slate-900 sm:py-3"
            >
              {t("title")}
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
