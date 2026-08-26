import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Product, Locale } from "@/types";
import { money } from "@/lib/utils";

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

  // ✅ Récupération des 2 premières specs comme dans la maquette
  const spec1 = product.specs[0]
    ? `${product.specs[0].label[locale]}: ${product.specs[0].value}`
    : "";
  const spec2 = product.specs[1]
    ? `${product.specs[1].label[locale]}: ${product.specs[1].value}`
    : "";

  // ✅ Badge de stock avec couleurs dynamiques
  const stockLabel = product.isDigital ? "∞" : product.stock;
  const stockClass =
    product.stock > 10
      ? "bg-green-100 text-green-800"
      : product.stock > 0
        ? "bg-yellow-100 text-yellow-800"
        : "bg-red-100 text-red-800";

  // ✅ Étoiles (comme dans la maquette : ★★★★★)
  const stars =
    "★".repeat(Math.round(product.rating)) +
    "☆".repeat(5 - Math.round(product.rating));

  return (
    <article className="group">
      <Link
        href={`/product/${product.slug}`}
        className="block w-full text-left"
      >
        {/* Image + badges */}
        <div className="relative aspect-square overflow-hidden bg-slate-100">
          <Image
            src={variant.images[0]?.url || ""}
            alt={name}
            fill
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            loading="lazy"
          />
          {badge && (
            <span className="absolute left-2 top-2 bg-white px-2 py-1 text-[9px] font-bold uppercase tracking-wider sm:left-3 sm:top-3 sm:text-[10px]">
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

        {/* Contenu texte (exactement comme la maquette) */}
        <div className="pt-2 sm:pt-3">
          {/* 1. Catégorie */}
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 sm:text-[10px]">
            {categoryName}
          </p>

          {/* 2. Nom du produit */}
          <h3 className="mt-1 line-clamp-2 text-sm font-bold group-hover:text-brand-600">
            {name}
          </h3>

          {/* ✅ 3. Spécifications (les 2 premières) */}
          {spec1 && (
            <p className="mt-0.5 text-[10px] text-slate-500 sm:text-xs">
              {spec1}
            </p>
          )}
          {spec2 && (
            <p className="text-[10px] text-slate-500 sm:text-xs">{spec2}</p>
          )}

          {/* ✅ 4. Étoiles + nombre d'avis */}
          <div className="mt-1 flex items-center gap-2 sm:mt-2">
            <span className="text-xs font-bold text-amber-500">{stars}</span>
            <span className="text-xs text-slate-400">
              ({product.reviewCount})
            </span>
          </div>

          {/* ✅ 5. Prix formaté avec Intl.NumberFormat */}
          <div className="mt-1 flex items-center gap-2 sm:mt-2">
            <span className="text-sm font-black">{money(product.price)}</span>
            {product.oldPrice && (
              <span className="text-xs text-slate-400 line-through">
                {money(product.oldPrice)}
              </span>
            )}
          </div>

          {/* 6. Stock + garantie */}
          <div className="mt-1 flex items-center gap-2">
            <span
              className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase sm:px-3 sm:py-1 sm:text-xs ${stockClass}`}
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
    </article>
  );
}
