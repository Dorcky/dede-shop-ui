import { useTranslations } from "next-intl";
import { Spec, Locale } from "@/types";

interface ProductSpecsProps {
  specs: Spec[];
  locale: Locale;
}

export default function ProductSpecs({ specs, locale }: ProductSpecsProps) {
  const t = useTranslations("product");

  if (!specs || specs.length === 0) return null;

  return (
    <section className="mt-12 border-t border-slate-200 pt-10 sm:mt-16 sm:pt-14">
      <p className="text-xs font-bold uppercase tracking-[.25em] text-brand-600">
        {t("specs")}
      </p>
      <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
        {t("details")}
      </h2>
      <div className="mt-4 overflow-x-auto sm:mt-6">
        <table className="w-full max-w-2xl text-sm">
          <tbody>
            {specs.map((spec, idx) => (
              <tr
                key={idx}
                className={`border-b border-slate-200 ${
                  idx % 2 === 0 ? "bg-slate-50" : "bg-white"
                }`}
              >
                <td className="px-4 py-3 font-bold text-slate-700 sm:px-5">
                  {spec.label[locale]}
                </td>
                <td className="px-4 py-3 text-slate-600 sm:px-5">
                  {spec.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
