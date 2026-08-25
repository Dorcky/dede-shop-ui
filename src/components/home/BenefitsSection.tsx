import { useTranslations } from "next-intl";
import { Lock, Zap, ShieldCheck, Headphones } from "lucide-react";

export default function BenefitsSection() {
  const t = useTranslations("benefits");

  const benefits = [
    {
      icon: <Lock className="h-8 w-8 sm:h-10 sm:w-10" />,
      title: t("secure.title"),
      desc: t("secure.desc")
    },
    {
      icon: <Zap className="h-8 w-8 sm:h-10 sm:w-10" />,
      title: t("express.title"),
      desc: t("express.desc")
    },
    {
      icon: <ShieldCheck className="h-8 w-8 sm:h-10 sm:w-10" />,
      title: t("warranty.title"),
      desc: t("warranty.desc")
    },
    {
      icon: <Headphones className="h-8 w-8 sm:h-10 sm:w-10" />,
      title: t("support.title"),
      desc: t("support.desc")
    }
  ];

  return (
    <section className="border-y bg-white py-10 sm:py-14">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 text-center md:grid-cols-4 lg:gap-8 lg:px-8">
        {benefits.map((b, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="text-brand-600">{b.icon}</div>
            <h3 className="mt-3 text-sm font-bold text-slate-900 sm:mt-4 sm:text-base">
              {b.title}
            </h3>
            <p className="mt-1 text-xs leading-5 text-slate-500 sm:mt-2 sm:text-sm">
              {b.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
