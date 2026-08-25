"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useTransition } from "react";
import { Globe } from "lucide-react";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleChange = (nextLocale: Locale) => {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <div className="flex items-center gap-2 text-xs font-bold">
      <Globe className="h-4 w-4 text-slate-500" />
      {routing.locales.map((l) => (
        <button
          key={l}
          onClick={() => handleChange(l)}
          disabled={isPending || l === locale}
          className={`uppercase transition ${
            l === locale
              ? "text-brand-600"
              : "text-slate-500 hover:text-brand-600"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
