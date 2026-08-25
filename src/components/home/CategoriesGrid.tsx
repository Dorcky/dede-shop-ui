import { getCategories } from "@/lib/db";
import { getTranslations } from "next-intl/server"; // ✅ Fonction async, pas un Hook
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Locale } from "@/i18n/routing";

export default async function CategoriesGrid({ locale }: { locale: Locale }) {
  // ✅ On await la fonction de traduction AVANT de faire d'autres appels
  const t = await getTranslations("home");
  const categories = await getCategories();

  return (
    <section className="mx-auto grid max-w-7xl gap-5 px-4 py-12 sm:grid-cols-2 md:grid-cols-3 lg:gap-7 lg:px-8 lg:py-16">
      {categories.map((cat) => (
        <div
          key={cat.id}
          className="group relative h-[300px] overflow-hidden sm:h-[380px] lg:h-[420px]"
        >
          <Image
            src={cat.image}
            alt={cat.name[locale]}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 text-white sm:p-7">
            <h3 className="text-2xl font-black sm:text-3xl">
              {cat.name[locale]}
            </h3>
            <p className="mt-1 max-w-xs text-sm text-white/90 sm:mt-2">
              {cat.description[locale]}
            </p>
            <Link
              href={`/shop?category=${cat.slug}`}
              className="mt-4 w-max bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-900 transition hover:bg-brand-50 sm:mt-5 sm:px-5 sm:py-3"
            >
              {t("explore")}
            </Link>
          </div>
        </div>
      ))}
    </section>
  );
}
