import { getProducts, getCategories } from "@/lib/db";
import { getTranslations } from "next-intl/server";
import { Locale } from "@/i18n/routing";
import ShopFilters from "@/components/shop/ShopFilters";
import ProductCard from "@/components/product/ProductCard";

interface ShopPageProps {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{
    category?: string;
    sort?: string;
    search?: string;
  }>;
}

export default async function ShopPage({
  params,
  searchParams
}: ShopPageProps) {
  const { locale } = await params;
  const { category, sort, search } = await searchParams;

  const t = await getTranslations("shop");
  const products = await getProducts();
  const categories = await getCategories();

  // 1. Filtrage côté serveur
  const filteredProducts = products.filter((p) => {
    // Filtre par catégorie (slug)
    if (category && category !== "all") {
      const cat = categories.find((c) => c.slug === category);
      if (p.categoryId !== cat?.id) return false;
    }

    // Filtre par recherche (nom ou description)
    if (search) {
      const searchLower = search.toLowerCase();
      const nameMatch = p.name[locale].toLowerCase().includes(searchLower);
      const descMatch = p.description[locale]
        .toLowerCase()
        .includes(searchLower);
      if (!nameMatch && !descMatch) return false;
    }

    return true;
  });

  // 2. Tri côté serveur
  if (sort === "priceAsc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sort === "priceDesc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sort === "rating") {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  } else {
    // "featured" par défaut : produits mis en avant en premier
    filteredProducts.sort(
      (a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
      {/* En-tête de la page */}
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[.25em] text-brand-600">
          DNK Tech Boutique
        </p>
        <h1 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          {t("subtitle")}
        </p>
      </div>

      {/* Barre de filtres */}
      <ShopFilters categories={categories} />

      {/* Compteur de résultats */}
      <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4">
        <p className="text-sm font-medium text-slate-600">
          <span className="font-bold text-slate-900">
            {filteredProducts.length}
          </span>{" "}
          {t("productCount")}
        </p>
      </div>

      {/* Grille de produits ou État vide */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 py-16 text-center sm:py-24">
          <p className="text-lg font-bold text-slate-900">{t("noResults")}</p>
          <p className="mt-2 text-sm text-slate-500">{t("noResultsHint")}</p>
        </div>
      )}
    </section>
  );
}
