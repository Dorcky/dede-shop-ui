import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  const t = useTranslations("errors");

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center sm:py-24">
      <FileQuestion className="h-16 w-16 text-slate-300 sm:h-20 sm:w-20" />
      <h1 className="mt-6 text-2xl font-black text-slate-900 sm:text-3xl">
        {t("notFound")}
      </h1>
      <p className="mt-2 text-sm text-slate-500 sm:mt-3">{t("notFoundDesc")}</p>

      {/* ✅ Texte traduit via la clé "backToShop" */}
      <Link
        href="/shop"
        className="mt-6 inline-flex items-center justify-center bg-slate-900 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-brand-700 sm:px-8 sm:py-4"
      >
        {t("backToShop")}
      </Link>
    </div>
  );
}
