import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getProductBySlug, getProducts, getCategories } from "@/lib/db";
import { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";

// Composants
import ProductDetailTop from "@/components/product/ProductDetailTop";
import ProductSpecs from "@/components/product/ProductSpecs";
import ProductDescription from "@/components/product/ProductDescription";
import RelatedProducts from "@/components/product/RelatedProducts";
import ProductReviews from "@/components/product/ProductReviews"; // ✅ Le composant mis à jour du Sprint 10

interface ProductPageProps {
  params: Promise<{ locale: Locale; slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations("product");

  // 1. Récupération des données
  const product = await getProductBySlug(slug);
  if (!product) {
    notFound();
  }

  const allProducts = await getProducts();
  const categories = await getCategories();
  const category = categories.find((c) => c.id === product.categoryId);

  // 2. Préparation des données connexes
  const similarProducts = allProducts
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  const boughtTogether = allProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  // ✅ NOTE : Nous avons supprimé "mockReviews" car le composant <ProductReviews>
  // gère maintenant lui-même la récupération des avis via le store Zustand.

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-10">
      {/* Bouton retour */}
      <Link
        href="/shop"
        className="mb-6 inline-block text-sm font-semibold text-slate-500 transition hover:text-brand-600 sm:mb-8"
      >
        {t("back")}
      </Link>

      {/* Galerie + Infos Produit (Gère l'état partagé des variantes/images) */}
      <ProductDetailTop
        product={product}
        categoryName={category?.name[locale] || ""}
        locale={locale}
      />

      {/* Spécifications techniques */}
      <ProductSpecs specs={product.specs} locale={locale} />

      {/* Description détaillée (paragraphes + images) */}
      <ProductDescription
        blocks={product.descriptionBlocks}
        productName={product.name[locale]}
        locale={locale}
      />

      {/* Souvent achetés ensemble */}
      <RelatedProducts
        title={t("boughtTogether")}
        subtitle={t("completeStyle")}
        products={boughtTogether}
        locale={locale}
      />

      {/* ✅ Avis clients : On passe juste l'objet product, le composant fait le reste ! */}
      <ProductReviews product={product} />

      {/* Produits similaires */}
      <RelatedProducts
        title={t("similarProducts")}
        subtitle={t("youMayAlsoLike")}
        products={similarProducts}
        locale={locale}
      />
    </section>
  );
}
