"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useTranslations, useLocale } from "next-intl";
import {
  Search,
  X,
  Clock,
  TrendingUp,
  Trash2,
  Package,
  ChevronRight
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "@/i18n/navigation";
import { getProducts, getCategories } from "@/lib/db";
import type { Product, Category } from "@/types";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const t = useTranslations("search");
  const locale = (useLocale() as "fr" | "en") || "fr";
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // ✅ REF pour gérer le debounce sans useEffect
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ✅ State pour savoir si le composant est monté côté client (nécessaire pour le Portal)
  const [mounted, setMounted] = useState(false);

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Montage côté client uniquement
  useEffect(() => {
    setMounted(true);
  }, []);

  const saveRecentSearch = useCallback((searchTerm: string) => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;

    setRecentSearches((prev) => {
      const updated = [trimmed, ...prev.filter((s) => s !== trimmed)].slice(
        0,
        5
      );
      localStorage.setItem("dnk-recent-searches", JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Chargement initial des données (catégories et tendances)
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem("dnk-recent-searches");
      if (saved) setRecentSearches(JSON.parse(saved));

      Promise.all([getCategories(), getProducts()]).then(([cats, prods]) => {
        setCategories(cats.slice(0, 6));
        setTrendingProducts(prods.filter((p) => p.isFeatured).slice(0, 4));
      });
    }
  }, [isOpen]);

  // Gestion du focus et nettoyage au montage/démontage
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setSuggestions([]);
      setSelectedIndex(-1);
    }

    // Nettoyage du timeout si le composant est démonté
    return () => {
      document.body.style.overflow = "";
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [isOpen]);

  // Gestion du clavier (Flèches et Entrée)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      } else if (e.key === "Enter" && selectedIndex >= 0) {
        e.preventDefault();
        const selectedProduct = suggestions[selectedIndex];
        if (selectedProduct) {
          saveRecentSearch(query.trim());
          onClose();
          router.push(`/product/${selectedProduct.slug}`);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    isOpen,
    onClose,
    suggestions,
    selectedIndex,
    query,
    router,
    saveRecentSearch
  ]);

  // ✅ Gestionnaire de saisie avec debounce DIRECT
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1); // Réinitialiser la sélection clavier à chaque frappe

    // Annuler le timer précédent
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Lancer la recherche après 300ms d'inactivité
    if (value.trim().length >= 2) {
      setIsLoading(true);
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const prods = await getProducts();
          const q = value.toLowerCase();
          const filtered = prods.filter(
            (p) =>
              p.name[locale].toLowerCase().includes(q) ||
              p.description[locale].toLowerCase().includes(q) ||
              p.brand?.toLowerCase().includes(q)
          );
          setSuggestions(filtered.slice(0, 8));
        } catch (error) {
          console.error("Erreur de recherche:", error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setIsLoading(false);
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("dnk-recent-searches");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      saveRecentSearch(query.trim());
      onClose();
      router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSuggestionClick = (product: Product) => {
    saveRecentSearch(query.trim());
    onClose();
    router.push(`/product/${product.slug}`);
  };

  const handleCategoryClick = (slug: string) => {
    onClose();
    router.push(`/shop?category=${slug}`);
  };

  const highlightMatch = (text: string, searchQuery: string) => {
    if (!searchQuery.trim()) return text;
    const regex = new RegExp(`(${searchQuery})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="bg-yellow-200 font-bold text-slate-900">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // ✅ Si le composant n'est pas monté côté client ou si la modale est fermée, on ne rend rien
  if (!mounted || !isOpen) return null;

  const showDefaultContent =
    query.trim().length < 2 && suggestions.length === 0;

  // ✅ Utilisation de createPortal pour placer la modale directement dans le body
  return createPortal(
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[9998] bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Contenu de la modale */}
      <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto p-4 sm:items-center sm:p-6">
        <div className="w-full max-w-2xl bg-white shadow-2xl sm:rounded-none">
          {/* Barre de recherche */}
          <form
            onSubmit={handleSubmit}
            className="border-b border-slate-200 p-4 sm:p-5"
          >
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5 shrink-0 text-slate-400" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={handleInputChange}
                placeholder={t("placeholder")}
                className="flex-1 bg-transparent text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
                autoComplete="off"
              />
              {isLoading && (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-brand-600" />
              )}
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-1.5 text-slate-500 transition hover:bg-slate-100"
                aria-label={t("close")}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </form>

          {/* Contenu déroulant */}
          <div className="max-h-[70vh] overflow-y-auto p-4 sm:p-5">
            {/* ===== AUTOCOMPLÉTION ===== */}
            {suggestions.length > 0 && (
              <div className="mb-6">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                  {t("suggestions")}
                </p>
                <div className="space-y-1">
                  {suggestions.map((product, index) => (
                    <button
                      key={product.id}
                      onClick={() => handleSuggestionClick(product)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex w-full items-center gap-3 rounded-none p-3 text-left transition ${
                        index === selectedIndex
                          ? "border-l-4 border-brand-600 bg-brand-50"
                          : "border-l-4 border-transparent hover:bg-slate-50"
                      }`}
                    >
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-none bg-slate-100">
                        <Image
                          src={product.variants[0]?.images[0]?.url || ""}
                          alt={product.name[locale]}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="min-w-0 flex-1 text-left">
                        <p className="truncate text-sm font-bold text-slate-900">
                          {highlightMatch(product.name[locale], query)}
                        </p>
                        <p className="text-xs text-slate-500">
                          {product.brand} · {product.price} $
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleSubmit}
                  className="mt-3 w-full border-t border-slate-200 pt-3 text-center text-sm font-bold text-brand-600 hover:text-brand-700"
                >
                  {t("viewAll")} →
                </button>
              </div>
            )}

            {/* ===== CONTENU PAR DÉFAUT ===== */}
            {showDefaultContent && (
              <>
                {recentSearches.length > 0 && (
                  <div className="mb-6">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                        <Clock className="h-3.5 w-3.5" />
                        {t("recent")}
                      </p>
                      <button
                        onClick={clearRecentSearches}
                        className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-red-600"
                      >
                        <Trash2 className="h-3 w-3" />
                        {t("clearRecent")}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((search, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setQuery(search);
                            inputRef.current?.focus();
                            // Déclencher manuellement la recherche si on clique sur l'historique
                            handleInputChange({
                              target: { value: search }
                            } as React.ChangeEvent<HTMLInputElement>);
                          }}
                          className="flex items-center gap-1.5 rounded-none border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-brand-600 hover:text-brand-600"
                        >
                          <Clock className="h-3 w-3" />
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {categories.length > 0 && (
                  <div className="mb-6">
                    <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                      <TrendingUp className="h-3.5 w-3.5" />
                      {t("popular")}
                    </p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => handleCategoryClick(cat.slug)}
                          className="group relative aspect-[4/3] overflow-hidden rounded-none border border-slate-200 transition hover:border-brand-600"
                        >
                          <Image
                            src={cat.image}
                            alt={cat.name[locale]}
                            fill
                            className="object-cover transition duration-300 group-hover:scale-105"
                            sizes="(max-width: 640px) 50vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                          <span className="absolute bottom-2 left-2 text-xs font-bold text-white sm:text-sm">
                            {cat.name[locale]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {trendingProducts.length > 0 && (
                  <div>
                    <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                      <TrendingUp className="h-3.5 w-3.5 text-brand-600" />
                      {t("trending")}
                    </p>
                    <div className="space-y-2">
                      {trendingProducts.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleSuggestionClick(product)}
                          className="flex w-full items-center gap-3 rounded-none border border-slate-200 p-3 text-left transition hover:border-brand-600 hover:bg-slate-50"
                        >
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-none bg-slate-100">
                            <Image
                              src={product.variants[0]?.images[0]?.url || ""}
                              alt={product.name[locale]}
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                          </div>
                          <div className="min-w-0 flex-1 text-left">
                            <p className="truncate text-sm font-bold text-slate-900">
                              {product.name[locale]}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500">
                              {product.brand}
                            </p>
                            <div className="mt-1 flex items-center gap-2">
                              <span className="text-sm font-black text-slate-900">
                                {product.price} $
                              </span>
                              {product.oldPrice && (
                                <span className="text-xs text-slate-400 line-through">
                                  {product.oldPrice} $
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Aucun résultat */}
            {query.trim().length >= 2 &&
              suggestions.length === 0 &&
              !isLoading && (
                <div className="py-12 text-center">
                  <Package className="mx-auto h-12 w-12 text-slate-300" />
                  <p className="mt-4 text-sm font-bold text-slate-900">
                    {t("noResults")} &quot;{query}&quot;
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    {t("tryAnother")}
                  </p>
                </div>
              )}
          </div>
        </div>
      </div>
    </>,
    document.body // ✅ Portal direct dans le body
  );
}
