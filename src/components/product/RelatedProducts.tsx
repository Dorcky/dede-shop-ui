import ProductCard from "@/components/product/ProductCard";
import { Product, Locale } from "@/types";

interface RelatedProductsProps {
  title: string;
  subtitle: string;
  products: Product[];
  locale: Locale;
}

export default function RelatedProducts({
  title,
  subtitle,
  products,
  locale
}: RelatedProductsProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="mt-12 sm:mt-16 lg:mt-20">
      <div className="mb-5 flex flex-col justify-between gap-2 sm:mb-7 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.25em] text-brand-600">
            {subtitle}
          </p>
          <h2 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
            {title}
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-10 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} locale={locale} />
        ))}
      </div>
    </section>
  );
}
