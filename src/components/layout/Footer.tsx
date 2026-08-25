"use client"; // ⚠️ OBLIGATOIRE pour utiliser onSubmit / onClick

import { useState } from "react"; // ✅ Ajout
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Locale } from "@/i18n/routing";
import ComplaintModal from "@/components/complaint/ComplaintModal"; // ✅ Ajout

export default function Footer({}: { locale: Locale }) {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const [isComplaintOpen, setIsComplaintOpen] = useState(false); // ✅ Ajout

  return (
    <footer className="border-t bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {/* Brand */}
        <div>
          <Link href="/" className="text-2xl font-black tracking-[.25em]">
            DNK TECH
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-slate-500">
            {t("brandDesc")}
          </p>
        </div>

        {/* Shop */}
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider">
            {t("shop")}
          </h3>
          <div className="grid gap-3 text-sm text-slate-500">
            <Link href="/shop" className="hover:text-brand-600">
              {t("allProducts")}
            </Link>
            <Link
              href="/shop?category=smartphones"
              className="hover:text-brand-600"
            >
              {tNav("smartphones")}
            </Link>
            <Link
              href="/shop?category=laptops"
              className="hover:text-brand-600"
            >
              {tNav("laptops")}
            </Link>
            <Link href="/shop?category=audio" className="hover:text-brand-600">
              {tNav("audio")}
            </Link>
            <Link
              href="/shop?category=digital"
              className="hover:text-brand-600"
            >
              {tNav("digital")}
            </Link>
          </div>
        </div>

        {/* Help */}
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider">
            {t("help")}
          </h3>
          <div className="grid gap-3 text-sm text-slate-500">
            <Link href="/contact" className="hover:text-brand-600">
              {t("contact")}
            </Link>
            <Link href="/returns" className="hover:text-brand-600">
              {t("returns")}
            </Link>
            <Link href="/account" className="hover:text-brand-600">
              {t("orders")}
            </Link>
            {/* ✅ Bouton avec ouverture du modal */}
            <button
              onClick={() => setIsComplaintOpen(true)}
              className="text-left hover:text-brand-600"
            >
              {t("complaint")}
            </button>
          </div>
        </div>

        {/* Newsletter */}
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
              className="min-w-0 flex-1 border border-slate-300 px-3 py-2 text-sm focus:border-brand-600 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-slate-900 px-4 text-sm font-bold text-white hover:bg-brand-700"
            >
              {t("ok")}
            </button>
          </form>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t px-4 py-5 text-center text-xs text-slate-400">
        {t("copyright")}
      </div>

      {/* ✅ Modal de réclamation */}
      <ComplaintModal
        isOpen={isComplaintOpen}
        onClose={() => setIsComplaintOpen(false)}
      />
    </footer>
  );
}
