"use client";

import { useState, useEffect } from "react";
import { Link, useRouter, usePathname } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { X, Menu, ChevronDown, ChevronUp } from "lucide-react";
import { getCategories } from "@/lib/db";
import type { Category, Locale } from "@/types";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const t = useTranslations("nav");
  const locale = useLocale() as "fr" | "en";
  const router = useRouter();
  const pathname = usePathname();

  // Récupérer les catégories dynamiquement au montage du composant
  useEffect(() => {
    getCategories().then((cats) => {
      setCategories(
        cats.filter((c) => c.isActive).sort((a, b) => a.order - b.order)
      );
    });
  }, []);

  // Verrouille le scroll du body quand le menu est ouvert
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      // Restaure la position de scroll exacte
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
      }
    }

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLangChange = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale });
    setIsOpen(false);
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Bouton Hamburger */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-slate-700 transition-colors hover:text-brand-600 lg:hidden"
        aria-label={t("openMenu")} // ✅ TRADUIT
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Overlay du Menu Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex flex-col bg-white lg:hidden"
          style={{
            position: "fixed",
            top: "0px",
            left: "0px",
            right: "0px",
            bottom: "0px",
            height: "100dvh",
            width: "100vw",
            overflow: "hidden"
          }}
        >
          {/* En-tête du menu */}
          <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 py-4">
            <span className="text-xl font-black tracking-[.25em] text-slate-900">
              DNK TECH
            </span>
            <button
              onClick={closeMenu}
              className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100"
              aria-label={t("closeMenu")} // ✅ TRADUIT
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Liens de navigation - SCROLLABLE */}
          <nav
            className="flex-1 overflow-y-auto overflow-x-hidden bg-white px-4 py-4"
            style={{
              height: "calc(100dvh - 72px - 80px)",
              WebkitOverflowScrolling: "touch"
            }}
          >
            <ul className="grid gap-1">
              {/* Lien Tous les produits */}
              <li>
                <Link
                  href="/shop"
                  onClick={closeMenu}
                  className="block border-b border-slate-100 py-4 text-base font-semibold text-slate-800 transition-colors hover:pl-2 hover:text-brand-600 active:bg-slate-50"
                >
                  {t("all")}
                </Link>
              </li>

              {/* ✅ SOUS-MENU CATÉGORIES (Accordéon) */}
              <li className="border-b border-slate-100">
                <button
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  className="flex w-full items-center justify-between py-4 text-base font-semibold text-slate-800 transition-colors hover:text-brand-600 active:bg-slate-50"
                >
                  <span>{t("categories")}</span> {/* ✅ TRADUIT */}
                  {isCategoriesOpen ? (
                    <ChevronUp className="h-5 w-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-400" />
                  )}
                </button>

                {/* Liste des catégories (affichée si ouvert) */}
                {isCategoriesOpen && (
                  <ul className="mb-2 rounded-md bg-slate-50 py-2 pl-4 pr-2">
                    {categories.map((cat) => (
                      <li key={cat.id}>
                        <Link
                          href={`/shop?category=${cat.slug}`}
                          onClick={closeMenu}
                          className="block border-l-2 border-transparent py-3 pl-2 text-sm font-medium text-slate-600 transition-colors hover:border-brand-600 hover:text-brand-600"
                        >
                          {cat.name[locale]}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>

              {/* Liens fixes */}
              <li>
                <Link
                  href="/about"
                  onClick={closeMenu}
                  className="block border-b border-slate-100 py-4 text-base font-semibold text-slate-800 transition-colors hover:pl-2 hover:text-brand-600 active:bg-slate-50"
                >
                  {t("about")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  onClick={closeMenu}
                  className="block border-b border-slate-100 py-4 text-base font-semibold text-slate-800 transition-colors hover:pl-2 hover:text-brand-600 active:bg-slate-50"
                >
                  {t("contact")}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Pied du menu (Switch de langue) */}
          <div className="shrink-0 border-t border-slate-200 bg-slate-50 px-4 py-4">
            <div className="flex items-center justify-center gap-3 text-sm font-bold">
              <span className="text-slate-500">{t("language")}</span>{" "}
              {/* ✅ TRADUIT */}
              <button
                onClick={() => handleLangChange("fr")}
                className={`uppercase transition ${
                  pathname.includes("/fr")
                    ? "text-brand-600"
                    : "text-slate-500 hover:text-brand-600"
                }`}
              >
                FR
              </button>
              <span className="text-slate-300">|</span>
              <button
                onClick={() => handleLangChange("en")}
                className={`uppercase transition ${
                  pathname.includes("/en")
                    ? "text-brand-600"
                    : "text-slate-500 hover:text-brand-600"
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
