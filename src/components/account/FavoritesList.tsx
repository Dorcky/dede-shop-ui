"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useFavorites } from "@/lib/store/useFavorites";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { money } from "@/lib/utils"; // ✅ Import de l'utilitaire de formatage monétaire

export default function FavoritesList() {
  const t = useTranslations("account");
  const locale = useLocale() as "fr" | "en";
  const { items, removeItem, clearFavorites } = useFavorites();

  const handleRemove = (productId: string, productName: string) => {
    removeItem(productId);
    // ✅ TRADUIT AVEC INTERPOLATION
    toast.info(t("removedFromFavorites", { productName }));
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-none border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
        <Heart className="h-12 w-12 text-slate-300" />
        <p className="mt-4 font-bold text-slate-900">{t("noFavorites")}</p>
        <p className="mt-1 max-w-sm text-sm text-slate-500">
          {t("noFavoritesDesc")}
        </p>
        <Link
          href="/shop"
          className="mt-6 flex items-center gap-2 rounded-none bg-slate-900 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-brand-700"
        >
          <ShoppingBag className="h-4 w-4" />
          {t("continueShopping")}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-black text-slate-900">
          {t("favorites")} ({items.length})
        </h2>
        <button
          onClick={() => {
            clearFavorites();
            // ✅ TRADUIT : Plus de texte en dur
            toast.success(t("allFavoritesRemoved"));
          }}
          className="flex items-center gap-2 rounded-none text-sm font-bold text-red-600 transition hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
          {t("clearAll")} {/* ✅ TRADUIT */}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.productId}
            className="group relative rounded-none border border-slate-200 bg-white transition hover:shadow-md"
          >
            {/* Bouton supprimer rapide */}
            <button
              onClick={() => handleRemove(item.productId, item.name[locale])}
              className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-500 opacity-0 shadow-sm backdrop-blur-sm transition hover:bg-red-50 group-hover:opacity-100"
              aria-label={t("remove")} // ✅ TRADUIT
            >
              <Trash2 className="h-4 w-4" />
            </button>

            <Link href={`/product/${item.slug}`} className="block">
              <div className="relative aspect-square overflow-hidden bg-slate-100">
                <Image
                  src={item.image}
                  alt={item.name[locale]}
                  fill
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
              </div>
              <div className="p-3 sm:p-4">
                <p className="text-xs text-slate-500">{item.brand}</p>
                <h3 className="mt-1 line-clamp-2 text-sm font-bold text-slate-900 group-hover:text-brand-600">
                  {item.name[locale]}
                </h3>
                <div className="mt-2 flex items-center gap-2">
                  {/* ✅ UTILITAIRE MONEY AU LIEU DE "$" EN DUR */}
                  <span className="text-sm font-black text-slate-900">
                    {money(item.price)}
                  </span>
                  {item.oldPrice && (
                    <span className="text-xs text-slate-400 line-through">
                      {money(item.oldPrice)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
