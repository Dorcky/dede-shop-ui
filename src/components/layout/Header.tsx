import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { getCategories, getSettings } from "@/lib/db";
import HeaderClientActions from "./HeaderClientActions";
import type { Locale } from "@/i18n/routing";

export default async function Header({ locale }: { locale: Locale }) {
  const t = await getTranslations("nav");

  // Récupération dynamique des données côté serveur
  const categories = await getCategories();
  const settings = await getSettings();
  const bannerText = settings.shipping.bannerText[locale as "fr" | "en"];

  return (
    <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
      {/* Bannière */}
      <div className="bg-brand-900 px-4 py-2 text-center text-xs font-medium text-white">
        {bannerText}
      </div>

      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-black tracking-[.25em] text-slate-900"
        >
          DNK TECH
        </Link>

        {/* Navigation Desktop */}
        <div className="hidden items-center gap-6 text-xs font-bold uppercase tracking-wider lg:flex">
          {/* ✅ MENU DÉROULANT CATÉGORIES (Pure CSS avec group-hover) */}
          <div className="group relative">
            <button className="flex items-center gap-1 text-slate-900 transition-colors hover:text-brand-600">
              Catégories
              {/* Petite flèche qui tourne au survol */}
              <svg
                className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Liste déroulante */}
            <div className="invisible absolute left-0 top-full z-50 mt-2 w-48 origin-top-left translate-y-2 rounded-md bg-white opacity-0 shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <div className="py-1">
                <Link
                  href="/shop"
                  className="block px-4 py-2.5 text-slate-700 transition-colors hover:bg-slate-50 hover:text-brand-600"
                >
                  {t("all")}
                </Link>

                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/shop?category=${cat.slug}`}
                    className="block px-4 py-2.5 text-slate-700 transition-colors hover:bg-slate-50 hover:text-brand-600"
                  >
                    {cat.name[locale as "fr" | "en"]}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Liens fixes */}
          <Link
            href="/about"
            className="text-slate-900 transition-colors hover:text-brand-600"
          >
            {t("about")}
          </Link>
          <Link
            href="/contact"
            className="text-slate-900 transition-colors hover:text-brand-600"
          >
            {t("contact")}
          </Link>
        </div>

        {/* Éléments interactifs (Panier, Compte, Recherche, Menu mobile) */}
        <HeaderClientActions locale={locale} />
      </nav>
    </header>
  );
}
