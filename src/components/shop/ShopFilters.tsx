"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Category, Product } from "@/types";
import { X, ChevronRight } from "lucide-react";
import Image from "next/image";
import { getProducts } from "@/lib/db";

interface ShopFiltersProps {
  categories: Category[];
}

export default function ShopFilters({ categories }: ShopFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("shop");
  const locale = (useLocale() as "fr" | "en") || "fr";

  const containerRef = useRef<HTMLDivElement>(null);

  // Valeurs actuelles des filtres
  const currentSearch = searchParams.get("search") || "";
  const currentCategory = searchParams.get("category") || "all";
  const currentSort = searchParams.get("sort") || "featured";

  // ✅ État local pour l'autocomplétion (indépendant du currentSearch de l'URL)
  const [searchInput, setSearchInput] = useState(currentSearch);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fonction pour mettre à jour l'URL
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all" || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const resetFilters = () => {
    setSearchInput("");
    router.push(pathname, { scroll: false });
  };

  const hasActiveFilters =
    currentSearch !== "" ||
    currentCategory !== "all" ||
    currentSort !== "featured";

  // ✅ Debounce autocomplétion (recherche live, indépendante du submit serveur)
  useEffect(() => {
    const q = searchInput.trim();

    if (q.length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timeoutId = setTimeout(async () => {
      try {
        const prods = await getProducts();
        const lower = q.toLowerCase();
        const filtered = prods.filter(
          (p) =>
            p.name[locale]?.toLowerCase().includes(lower) ||
            p.description[locale]?.toLowerCase().includes(lower) ||
            p.brand?.toLowerCase().includes(lower)
        );
        setSuggestions(filtered.slice(0, 6));
      } catch (error) {
        console.error("Erreur autocomplétion:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [searchInput, locale]);

  // ✅ Fermer le dropdown au clic en dehors
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSuggestionSelect = (product: Product) => {
    setSearchInput(product.name[locale]);
    setShowDropdown(false);
    updateFilter("search", product.name[locale]);
  };

  return (
    <div className="mb-8 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Recherche avec autocomplétion */}
        <div className="lg:col-span-1" ref={containerRef}>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">
            {t("searchPlaceholder")}
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => {
                if (suggestions.length > 0) setShowDropdown(true);
              }}
              onBlur={(e) => {
                // Le filtrage serveur se déclenche toujours au blur
                updateFilter("search", e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setShowDropdown(false);
                  updateFilter("search", (e.target as HTMLInputElement).value);
                } else if (e.key === "Escape") {
                  setShowDropdown(false);
                }
              }}
              placeholder={t("searchPlaceholder")}
              autoComplete="off"
              className="w-full border border-slate-300 px-3 py-2 text-sm transition-colors focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
            />

            {isLoading && (
              <div className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-slate-300 border-t-brand-600" />
            )}

            {/* Dropdown autocomplétion */}
            {showDropdown && suggestions.length > 0 && (
              <div className="absolute left-0 top-full z-30 mt-1 w-full max-w-sm border border-slate-200 bg-white shadow-lg">
                {suggestions.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    // ✅ onMouseDown se déclenche AVANT le onBlur de l'input
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSuggestionSelect(product);
                    }}
                    className="flex w-full items-center gap-3 border-b border-slate-100 p-2.5 text-left transition last:border-b-0 hover:bg-slate-50"
                  >
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden bg-slate-100">
                      <Image
                        src={
                          product.variants[0]?.images[0]?.url ||
                          "/images/placeholder.png"
                        }
                        alt={product.name[locale]}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-slate-900">
                        {product.name[locale]}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {product.brand} · {product.price} $
                      </p>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  </button>
                ))}
              </div>
            )}
          </div>
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
                {cat.name[locale]}
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
            <div className="h-[38px] w-full" />
          )}
        </div>
      </div>
    </div>
  );
}
