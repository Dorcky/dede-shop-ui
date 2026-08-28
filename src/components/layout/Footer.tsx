"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import ComplaintModal from "@/components/complaint/ComplaintModal";

// ✅ Type personnalisé pour la fonction de traduction (satisfait ESLint)
type TranslationFunction = (key: string) => string;

interface FooterLink {
  label: string;
  href: string;
  isComplaint?: boolean;
}

// Définition de la structure des liens basée sur les clés de traduction
const getFooterData = (t: TranslationFunction, tNav: TranslationFunction) => ({
  shop: [
    { label: t("allProducts"), href: "/shop" },
    { label: tNav("smartphones"), href: "/shop?category=smartphones" },
    { label: tNav("laptops"), href: "/shop?category=laptops" },
    { label: tNav("audio"), href: "/shop?category=audio" },
    { label: tNav("digital"), href: "/shop?category=digital" }
  ],
  help: [
    { label: t("contact"), href: "/contact" },
    { label: t("returns"), href: "/returns" },
    { label: t("orders"), href: "/account" },
    { label: t("complaint"), href: "#", isComplaint: true }
  ]
});

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const [isComplaintOpen, setIsComplaintOpen] = useState(false);

  const data = getFooterData(t, tNav);

  // Composant Accordéon pour mobile
  const MobileAccordion = ({
    title,
    items
  }: {
    title: string;
    items: FooterLink[];
  }) => (
    <details className="group border-b border-slate-200 py-4 lg:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-bold uppercase tracking-wider text-slate-900">
        {title}
        <ChevronDown className="h-4 w-4 transition-transform duration-200 group-open:rotate-180" />
      </summary>
      <div className="mt-3 grid gap-3 pl-2 text-sm text-slate-500">
        {items.map((item, i) =>
          item.isComplaint ? (
            <button
              key={i}
              onClick={() => setIsComplaintOpen(true)}
              className="text-left hover:text-brand-600"
            >
              {item.label}
            </button>
          ) : (
            <Link key={i} href={item.href} className="hover:text-brand-600">
              {item.label}
            </Link>
          )
        )}
      </div>
    </details>
  );

  // Composant Colonne pour desktop
  const DesktopColumn = ({
    title,
    items
  }: {
    title: string;
    items: FooterLink[];
  }) => (
    <div className="hidden lg:block">
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wider">
        {title}
      </h3>
      <div className="grid gap-3 text-sm text-slate-500">
        {items.map((item, i) =>
          item.isComplaint ? (
            <button
              key={i}
              onClick={() => setIsComplaintOpen(true)}
              className="text-left hover:text-brand-600"
            >
              {item.label}
            </button>
          ) : (
            <Link key={i} href={item.href} className="hover:text-brand-600">
              {item.label}
            </Link>
          )
        )}
      </div>
    </div>
  );

  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8 lg:py-14">
        {/* Mobile : Accordéons */}
        <div className="lg:hidden">
          <div className="mb-6">
            <Link href="/" className="text-2xl font-black tracking-[.25em]">
              DNK TECH
            </Link>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              {t("brandDesc")}
            </p>
          </div>
          <MobileAccordion title={t("shop")} items={data.shop} />
          <MobileAccordion title={t("help")} items={data.help} />

          {/* Newsletter toujours visible sur mobile */}
          <div className="border-b border-slate-200 py-4">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider">
              {t("newsletter")}
            </h3>
            <p className="mb-3 text-sm text-slate-500">{t("newsletterDesc")}</p>
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                required
                placeholder={t("newsletterPlaceholder")}
                className="min-w-0 flex-1 rounded-none border border-slate-300 px-3 py-2.5 text-sm focus:border-brand-600 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-none bg-slate-900 px-4 text-sm font-bold text-white hover:bg-brand-700"
              >
                {t("ok")}
              </button>
            </form>
          </div>
        </div>

        {/* Desktop : Grille classique */}
        <div className="hidden grid-cols-4 gap-10 lg:grid">
          <div className="col-span-1">
            <Link href="/" className="text-2xl font-black tracking-[.25em]">
              DNK TECH
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-500">
              {t("brandDesc")}
            </p>
          </div>
          <DesktopColumn title={t("shop")} items={data.shop} />
          <DesktopColumn title={t("help")} items={data.help} />

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider">
              {t("newsletter")}
            </h3>
            <p className="mb-4 text-sm text-slate-500">{t("newsletterDesc")}</p>
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                required
                placeholder={t("newsletterPlaceholder")}
                className="min-w-0 flex-1 rounded-none border border-slate-300 px-3 py-2.5 text-sm focus:border-brand-600 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-none bg-slate-900 px-4 text-sm font-bold text-white hover:bg-brand-700"
              >
                {t("ok")}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t px-4 py-5 text-center text-xs text-slate-400">
        {t("copyright")}
      </div>

      <ComplaintModal
        isOpen={isComplaintOpen}
        onClose={() => setIsComplaintOpen(false)}
      />
    </footer>
  );
}
