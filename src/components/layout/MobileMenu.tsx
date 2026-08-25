"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { X, Menu } from "lucide-react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("nav");
  const router = useRouter();
  const pathname = usePathname();

  // ⭐ Verrouille le scroll du body quand le menu est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  const navItems = [
    { href: "/shop", label: t("all") },
    { href: "/shop?category=smartphones", label: t("smartphones") },
    { href: "/shop?category=laptops", label: t("laptops") },
    { href: "/shop?category=audio", label: t("audio") },
    { href: "/shop?category=digital", label: t("digital") },
    { href: "/about", label: t("about") },
    { href: "/contact", label: t("contact") }
  ];

  const handleLangChange = (locale: Locale) => {
    router.replace(pathname, { locale });
    setIsOpen(false);
  };

  return (
    <>
      {/* Bouton Hamburger */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-slate-700 transition-colors hover:text-brand-600 lg:hidden"
        aria-label="Ouvrir le menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Overlay du Menu Mobile - Rendu via Portal-like avec fixed */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex flex-col bg-white lg:hidden"
          style={{
            position: "fixed",
            top: "0px",
            left: "0px",
            right: "0px",
            bottom: "0px",
            height: "100dvh", // Dynamic viewport height (parfait pour mobile)
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
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100"
              aria-label="Fermer le menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* ⭐ Liens de navigation - SCROLLABLE avec hauteur calculée */}
          <nav
            className="flex-1 overflow-y-auto overflow-x-hidden bg-white px-4 py-4"
            style={{
              // Force la hauteur restante après le header et le footer
              height: "calc(100dvh - 72px - 80px)",
              WebkitOverflowScrolling: "touch"
            }}
          >
            <ul className="grid gap-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block border-b border-slate-100 py-4 text-base font-semibold text-slate-800 transition-colors hover:pl-2 hover:text-brand-600 active:bg-slate-50"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Pied du menu (Switch de langue) */}
          <div className="shrink-0 border-t border-slate-200 bg-slate-50 px-4 py-4">
            <div className="flex items-center justify-center gap-3 text-sm font-bold">
              <span className="text-slate-500">Langue :</span>
              <button
                onClick={() => handleLangChange("fr")}
                className={`uppercase transition ${
                  routing.locales.includes("fr")
                    ? "text-brand-600"
                    : "text-slate-500"
                }`}
              >
                FR
              </button>
              <span className="text-slate-300">|</span>
              <button
                onClick={() => handleLangChange("en")}
                className="uppercase text-slate-500 hover:text-brand-600"
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
