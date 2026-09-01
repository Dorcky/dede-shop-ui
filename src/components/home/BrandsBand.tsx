"use client";

import { useTranslations } from "next-intl";
import { BRANDS } from "@/data/brands"; // ✅ Import des données

export default function BrandsBand() {
  const t = useTranslations("common");

  return (
    <section
      className="border-b bg-white py-7 sm:py-9"
      aria-label={t("brandsSectionLabel")} // ✅ Accessibilité traduite
    >
      <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-x-8 gap-y-4 px-4 text-center text-xl font-black tracking-widest text-slate-300 lg:justify-between lg:px-8">
        {BRANDS.map((brand) => (
          <span
            key={brand.id}
            className="transition-colors hover:text-slate-500"
          >
            {brand.name}
          </span>
        ))}
      </div>
    </section>
  );
}
