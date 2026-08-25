import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Star } from "lucide-react";
import { Product, Locale } from "@/types";

interface ProductCardProps {
  product: Product;
  locale: Locale;
}

export default function ProductCard({ product, locale }: ProductCardProps) {
  const variant = product.variants[0];
  const name = product.name[locale];
  const categoryName =
    product.categoryId === "cat1"
      ? "Smartphones"
      : product.categoryId === "cat2"
        ? "Ordinateurs"
        : product.categoryId === "cat3"
          ? "Audio"
          : "Numérique";
  const badge = product.badge ? product.badge[locale] : null;

  const stockLabel = product.isDigital ? "∞" : `${product.stock}`;
  const stockColor =
    product.stock > 10
      ? "bg-green-100 text-green-800"
      : product.stock > 0
        ? "bg-yellow-100 text-yellow-800"
        : "bg-red-100 text-red-800";

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <Image
          src={variant.images[0].url}
          alt={name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
        {badge && (
          <span className="absolute left-2 top-2 bg-white px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-900 sm:left-3 sm:top-3 sm:text-[10px]">
            {badge}
          </span>
        )}
        {product.isDigital && (
          <span className="absolute right-2 top-2 bg-brand-600 px-2 py-1 text-[9px] font-bold uppercase text-white sm:right-3 sm:top-3 sm:text-[10px]">
            Numérique
          </span>
        )}
        <span className="absolute bottom-2 left-2 bg-slate-900 px-2 py-1 text-[9px] font-bold text-white opacity-0 transition group-hover:opacity-100 sm:bottom-3 sm:left-3 sm:text-[10px]">
          Voir le produit
        </span>
      </div>

      <div className="pt-2 sm:pt-3">
        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 sm:text-[10px]">
          {categoryName}
        </p>
        <h3 className="mt-1 line-clamp-2 text-sm font-bold text-slate-900 group-hover:text-brand-600 sm:text-base">
          {name}
        </h3>

        <div className="mt-1 flex items-center gap-1 sm:mt-2">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400 sm:h-4 sm:w-4" />
          <span className="text-xs text-slate-500">
            ({product.reviewCount})
          </span>
        </div>

        <div className="mt-1 flex items-center gap-2 sm:mt-2">
          <span className="text-sm font-black text-slate-900 sm:text-base">
            {product.price} $
          </span>
          {product.oldPrice && (
            <span className="text-xs text-slate-400 line-through">
              {product.oldPrice} $
            </span>
          )}
        </div>

        <div className="mt-1 flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase sm:px-2.5 sm:py-1 sm:text-[10px] ${stockColor}`}
          >
            {stockLabel}
          </span>
          {product.warranty > 0 && (
            <span className="text-[9px] text-slate-400 sm:text-[10px]">
              {product.warranty} mois
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
