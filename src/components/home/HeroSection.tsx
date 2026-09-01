import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";

export default function HeroSection() {
  const t = useTranslations("home");

  return (
    <section className="relative flex min-h-[500px] items-end bg-slate-900 sm:min-h-[620px]">
      <Image
        src="https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1800"
        alt={t("heroImageAlt")}
        fill
        className="object-cover opacity-60"
        priority
        sizes="100vw"
      />
      <div className="relative mx-auto w-full max-w-7xl px-4 pb-14 text-white sm:pb-20 lg:px-8">
        <div className="max-w-2xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[.3em] text-brand-300 sm:mb-4">
            {t("banner")}
          </p>
          <h1 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            {t("title")}
          </h1>
          <p className="mt-4 max-w-xl text-base text-slate-200 sm:text-lg">
            {t("subtitle")}
          </p>
          <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
            <Link
              href="/shop"
              className="bg-white px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-900 transition hover:bg-brand-100 sm:px-6"
            >
              {t("buyNow")}
            </Link>
            <Link
              href="/about"
              className="border border-white px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-white hover:text-slate-900 sm:px-6"
            >
              {t("discover")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
