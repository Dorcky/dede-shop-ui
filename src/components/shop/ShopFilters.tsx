"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Category } from "@/types";
import { X } from "lucide-react";

interface ShopFiltersProps {
  categories: Category[];
}

export default function ShopFilters({ categories }: ShopFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("shop");

  // Valeurs actuelles des filtres
  const currentSearch = searchParams.get("search") || "";
  const currentCategory = searchParams.get("category") || "all";
  const currentSort = searchParams.get("sort") || "featured";

  // Fonction pour mettre à jour l'URL
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all" || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    // Remet la page à 1 si on change un filtre (optionnel, utile pour la pagination future)
    params.delete("page");

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const resetFilters = () => {
    router.push(pathname, { scroll: false });
  };

  const hasActiveFilters =
    currentSearch !== "" ||
    currentCategory !== "all" ||
    currentSort !== "featured";

  return (
    <div className="mb-8 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Recherche */}
        <div className="lg:col-span-1">
          <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">
            {t("searchPlaceholder")}
          </label>
          <input
            type="text"
            defaultValue={currentSearch}
            onBlur={(e) => updateFilter("search", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateFilter("search", (e.target as HTMLInputElement).value);
              }
            }}
            placeholder={t("searchPlaceholder")}
            className="w-full border border-slate-300 px-3 py-2 text-sm transition-colors focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
          />
        </div>

        {/* Catégorie */}
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">
            {t("category")}
          </label>
          <select
            value={currentCategory}
            onChange={(e) => updateFilter("category", e.target.value)}
            className="w-full border border-slate-300 px-3 py-2 text-sm transition-colors focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
          >
            <option value="all">{t("allCategories")}</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name.fr}{" "}
                {/* On pourrait utiliser la locale dynamique ici, simplifié pour l'exemple */}
              </option>
            ))}
          </select>
        </div>

        {/* Tri */}
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">
            {t("sort")}
          </label>
          <select
            value={currentSort}
            onChange={(e) => updateFilter("sort", e.target.value)}
            className="w-full border border-slate-300 px-3 py-2 text-sm transition-colors focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
          >
            <option value="featured">{t("featured")}</option>
            <option value="priceAsc">{t("priceAsc")}</option>
            <option value="priceDesc">{t("priceDesc")}</option>
            <option value="rating">{t("rating")}</option>
          </select>
        </div>

        {/* Bouton Réinitialiser */}
        <div className="flex items-end">
          {hasActiveFilters ? (
            <button
              onClick={resetFilters}
              className="flex w-full items-center justify-center gap-2 border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-700 transition hover:bg-red-100"
            >
              <X className="h-4 w-4" />
              {t("reset")}
            </button>
          ) : (
            <div className="h-[38px] w-full" /> /* Spacer pour aligner avec les inputs */
          )}
        </div>
      </div>
    </div>
  );
}
