import { getProducts } from "@/lib/db";
import { getTranslations } from "next-intl/server"; // ✅ Fonction async, pas un Hook
import { Link } from "@/i18n/navigation";
import ProductCard from "@/components/product/ProductCard";
import { Locale } from "@/i18n/routing";

export default async function FeaturedProducts({ locale }: { locale: Locale }) {
  // ✅ On await la fonction de traduction AVANT de faire d'autres appels
  const t = await getTranslations("home");
  const products = await getProducts();
  const featured = products.filter((p) => p.isFeatured).slice(0, 5);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-10">
      <div className="mb-6 flex flex-col justify-between gap-3 sm:mb-10 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.25em] text-brand-600">
            {t("selection")}
          </p>
          <h2 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
            {t("popularProducts")}
          </h2>
        </div>
        <Link
          href="/shop"
          className="text-sm font-bold text-brand-700 hover:underline"
        >
          {t("viewAll")}
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-10 lg:grid-cols-5">
        {featured.map((product) => (
          <ProductCard key={product.id} product={product} locale={locale} />
        ))}
      </div>
    </section>
  );
}
