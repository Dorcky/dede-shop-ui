import { getContactContent, getContactTopics } from "@/lib/db";
import { Locale } from "@/i18n/routing";
import ContactForm from "@/components/contact/ContactForm";

export default async function ContactPage({
  params
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const content = await getContactContent();
  const topics = await getContactTopics();

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
          <p className="mt-4 max-w-lg text-sm leading-7 text-slate-600 sm:mt-5">
            {content.description[locale]}
          </p>
          <div className="mt-8 grid gap-5 text-sm sm:mt-10 sm:gap-6">
            <div>
              <p className="font-bold text-slate-900">Courriel</p>
              <a
                href={`mailto:${content.email}`}
                className="mt-1 block text-brand-700 hover:underline"
              >
                {content.email}
              </a>
            </div>
            <div>
              <p className="font-bold text-slate-900">Téléphone</p>
              <a
                href={`tel:${content.phone}`}
                className="mt-1 block text-brand-700 hover:underline"
              >
                {content.phone}
              </a>
            </div>
            <div>
              <p className="font-bold text-slate-900">
                Heures d&apos;ouverture
              </p>
              <p className="mt-1 text-slate-500">
                {content.openingHours[locale]}
              </p>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <ContactForm topics={topics} locale={locale} />
      </div>
    </section>
  );
}
