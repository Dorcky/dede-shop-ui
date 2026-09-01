"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Variant, Locale, Translatable } from "@/types";
import { ShoppingCart, ShieldCheck, Truck, Star } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { useCart } from "@/lib/store/useCart";
import { money } from "@/lib/utils"; // ✅ Ajouté pour la cohérence des prix

interface ProductInfoProps {
  productId: string;
  productSlug: string;
  categoryName: string;
  productName: Translatable;
  brand: string;
  price: number;
  oldPrice?: number;
  stock: number;
  warranty: number;
  isDigital: boolean;
  rating: number;
  reviewCount: number;
  variants: Variant[];
  selectedVariantIndex: number;
  onVariantChange: (index: number) => void;
  locale: Locale;
}

export default function ProductInfo({
  productId,
  productSlug,
  categoryName,
  productName,
  brand,
  price,
  oldPrice,
  stock,
  warranty,
  isDigital,
  rating,
  reviewCount,
  variants,
  selectedVariantIndex,
  onVariantChange,
  locale
}: ProductInfoProps) {
  const t = useTranslations("product");
  const [quantity, setQuantity] = useState(1);
  const addItem = useCart((state) => state.addItem);

  const selectedVariant = variants[selectedVariantIndex];

  const stockLabel = isDigital
    ? "∞"
    : stock > 10
      ? t("inStock")
      : stock > 0
        ? t("lowStock")
        : t("outOfStock");

  const stockColor = isDigital
    ? "bg-brand-100 text-brand-700"
    : stock > 10
      ? "bg-green-100 text-green-800"
      : stock > 0
        ? "bg-yellow-100 text-yellow-800"
        : "bg-red-100 text-red-800";

  const handleAddToCart = () => {
    addItem(
      {
        productId,
        productSlug,
        variantId: selectedVariant.id,
        name: productName, // ✅ objet complet, plus productName tout court résolu
        variantName: selectedVariant.name, // ✅ objet complet, plus [locale]
        price,
        image: selectedVariant.images[0]?.url || "",
        isDigital
      },
      quantity
    );
    toast.success(
      t("addedToCart", { productName: productName[locale], quantity })
    ); // ✅ résolu ici pour le toast
  };

  const renderStars = (value: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.round(value)
            ? "fill-amber-400 text-amber-400"
            : "fill-slate-200 text-slate-200"
        }`}
      />
    ));
  };

  return (
    <div className="flex flex-col">
      {/* Catégorie et Nom */}
      <p className="text-xs font-bold uppercase tracking-[.25em] text-brand-600">
        {categoryName}
      </p>
      <h1 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
        {productName[locale]}
      </h1>

      {/* Note et avis */}
      <div className="mt-3 flex flex-wrap items-center gap-3 sm:mt-4">
        <div className="flex items-center gap-0.5">{renderStars(rating)}</div>
        <button className="text-sm text-slate-500 underline hover:text-brand-600">
          {reviewCount} {t("reviewsCount")}
        </button>
      </div>

      {/* Prix */}
      <div className="mt-4 flex items-center gap-3 sm:mt-6">
        <span className="text-2xl font-black text-slate-900 sm:text-3xl">
          {money(price)} {/* ✅ UTILITAIRE MONEY AU LIEU DE "$" EN DUR */}
        </span>
        {oldPrice && (
          <span className="text-sm text-slate-400 line-through sm:text-base">
            {money(oldPrice)} {/* ✅ UTILITAIRE MONEY */}
          </span>
        )}
        {isDigital && (
          <span className="ml-2 rounded-full bg-brand-100 px-3 py-1 text-[10px] font-bold uppercase text-brand-700 sm:text-xs">
            {t("digital")}
          </span>
        )}
      </div>

      {/* Stock, garantie, marque */}
      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase ${stockColor}`}
        >
          {stockLabel}
        </span>
        {warranty > 0 && (
          <span className="flex items-center gap-1 text-slate-600">
            <ShieldCheck className="h-4 w-4" />
            {warranty} {t("months")} {/* ✅ TRADUIT */}
          </span>
        )}
        {brand && <span className="font-semibold text-slate-700">{brand}</span>}
      </div>

      {/* Variantes */}
      {variants.length >= 1 && (
        <div className="mt-6 sm:mt-8">
          <p className="mb-2 text-sm font-bold text-slate-900">
            {t("variant")} : {selectedVariant.name[locale]}
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {variants.map((variant, idx) => (
              <button
                key={variant.id}
                onClick={() => onVariantChange(idx)}
                className={`flex items-center gap-2 border px-2 py-1 text-xs transition sm:px-3 sm:py-2 sm:text-sm ${
                  idx === selectedVariantIndex
                    ? "border-brand-600 ring-2 ring-brand-600"
                    : "border-slate-300 hover:border-slate-400"
                }`}
              >
                {variant.images && variant.images.length > 0 && (
                  <Image
                    src={variant.images[0].url}
                    alt={variant.name[locale]}
                    width={32}
                    height={32}
                    className="h-6 w-6 rounded object-cover sm:h-8 sm:w-8"
                  />
                )}
                <span>{variant.name[locale]}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantité + Ajouter au panier */}
      <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8">
        <div className="flex items-center border border-slate-300">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-2 text-lg transition hover:bg-slate-100 sm:px-4 sm:py-3"
            aria-label="Diminuer la quantité"
          >
            −
          </button>
          <span className="w-10 text-center text-sm font-bold sm:w-12">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-3 py-2 text-lg transition hover:bg-slate-100 sm:px-4 sm:py-3"
            aria-label="Augmenter la quantité"
          >
            +
          </button>
        </div>
        <button
          onClick={handleAddToCart}
          className="flex flex-1 items-center justify-center gap-2 bg-slate-900 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-brand-700 sm:flex-none sm:px-6 sm:py-4"
        >
          <ShoppingCart className="h-4 w-4" />
          {t("addToCart")}
        </button>
      </div>

      {/* Infos livraison/garantie */}
      <div className="mt-6 grid gap-3 border-y border-slate-200 py-4 text-sm text-slate-600 sm:mt-8 sm:grid-cols-2 sm:gap-4 sm:py-6">
        <div className="flex items-start gap-2">
          <Truck className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
          <div>
            <span className="font-bold text-slate-900">{t("shipping")}</span>
            <p className="mt-1 text-xs">{t("shippingInfo")}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
          <div>
            <span className="font-bold text-slate-900">{t("returns")}</span>
            <p className="mt-1 text-xs">
              {warranty > 0
                ? t("warrantyInfo", { count: warranty })
                : t("notApplicableDigital")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
