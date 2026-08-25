import { getReturnsContent } from "@/lib/db";
import { Locale } from "@/i18n/routing";
import ReturnsForm from "@/components/returns/ReturnsForm";

export default async function ReturnsPage({
  params
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const content = await getReturnsContent();

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
        {/* Colonne info */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[.25em] text-brand-600">
            {content.subtitle[locale]}
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
            {content.title[locale]}
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-600 sm:mt-5">
            {content.description[locale]}
          </p>
          <div className="mt-6 grid gap-4 text-sm sm:mt-8 sm:gap-5">
            {[
              {
                title: content.step1Title[locale],
                desc: content.step1Desc[locale]
              },
              {
                title: content.step2Title[locale],
                desc: content.step2Desc[locale]
              },
              {
                title: content.step3Title[locale],
                desc: content.step3Desc[locale]
              }
            ].map((step, i) => (
              <div key={i}>
                <p className="font-bold text-slate-900">{step.title}</p>
                <p className="mt-1 text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Formulaire */}
        <ReturnsForm locale={locale} />
      </div>
    </section>
  );
}
