import { getAboutContent } from "@/lib/db";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Locale } from "@/i18n/routing";

export default async function AboutPage({
  params
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const content = await getAboutContent();
  const t = await getTranslations("about");

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
      {/* Hero : texte + image */}
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-12">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.25em] text-brand-600">
            {content.subtitle[locale]}
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
            {content.title[locale]}
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-600 sm:mt-6">
            {content.description1[locale]}
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:mt-4">
            {content.description2[locale]}
          </p>
        </div>
        <div className="relative h-64 w-full overflow-hidden rounded-lg sm:h-80 lg:h-96">
          <Image
            src={content.heroImage}
            alt={t("heroImageAlt")} // ✅ TRADUCTION APPLIQUÉE ICI
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>
      </div>

      {/* 3 valeurs */}
      <div className="mt-12 grid gap-8 border-y border-slate-200 py-10 sm:mt-16 sm:grid-cols-3 sm:gap-10 sm:py-12 lg:mt-20">
        {[
          {
            num: "01",
            title: content.value1Title[locale],
            desc: content.value1Desc[locale]
          },
          {
            num: "02",
            title: content.value2Title[locale],
            desc: content.value2Desc[locale]
          },
          {
            num: "03",
            title: content.value3Title[locale],
            desc: content.value3Desc[locale]
          }
        ].map((v) => (
          <div key={v.num}>
            <p className="text-3xl font-black text-brand-600 sm:text-4xl">
              {v.num}
            </p>
            <h2 className="mt-2 text-xl font-bold text-slate-900">{v.title}</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500 sm:mt-2">
              {v.desc}
            </p>
          </div>
        ))}
      </div>

      {/* CTA final */}
      <div className="mt-12 text-center sm:mt-16 lg:mt-20">
        <p className="text-xs font-bold uppercase tracking-[.25em] text-brand-600">
          {t("ready")}
        </p>
        <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
          {t("findNext")}
        </h2>
        <Link
          href="/shop"
          className="mt-4 inline-block bg-slate-900 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-brand-700 sm:mt-6 sm:px-6 sm:py-3"
        >
          {t("shopBtn")}
        </Link>
      </div>
    </section>
  );
}
