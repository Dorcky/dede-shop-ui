import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";

export default function SpecialOffer() {
  const t = useTranslations("home");

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
      <div className="grid overflow-hidden bg-brand-700 text-white md:min-h-[620px] md:grid-cols-2">
        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-12">
          <p className="text-xs font-bold uppercase tracking-[.25em] text-brand-200">
            {t("limitedOffer")}
          </p>

          <h2 className="mt-2 text-3xl font-black sm:text-4xl">
            {t("specialTitle")}
          </h2>

          <p className="mt-4 max-w-md text-sm leading-6 text-brand-100 sm:mt-5">
            {t("specialSubtitle")}
          </p>

          <Link
            href="/shop?search=smartphone"
            className="mt-5 inline-block w-fit bg-white px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-900 transition hover:bg-brand-50 sm:mt-7"
          >
            {t("shopOffer")}
          </Link>
        </div>

        <div className="relative min-h-[280px] w-full md:min-h-0">
          <Image
            src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1000"
            alt={t("specialOfferImageAlt")}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}
