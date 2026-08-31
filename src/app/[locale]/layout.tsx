import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server"; // ✅ Ajout de getTranslations
import { notFound } from "next/navigation";
import { Toaster } from "sonner";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CookieConsent from "@/components/shared/CookieConsent";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// ✅ Remplacement de l'objet statique par une fonction dynamique
export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;

  // Récupère les traductions du namespace "common"
  const t = await getTranslations({ locale, namespace: "common" });

  return {
    title: t("siteTitle"),
    description: t("siteDescription"),
    // Vous pouvez aussi ajouter des Open Graph tags traduits ici si besoin
    openGraph: {
      title: t("siteTitle"),
      description: t("siteDescription")
    }
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 text-slate-800 antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header locale={locale} />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />

          {/* Notifications globales */}
          <Toaster
            position="bottom-right"
            toastOptions={{
              className: "bg-slate-900 text-white text-sm font-semibold",
              style: { background: "#0f172a", color: "white" },
              duration: 4000
            }}
          />

          {/* Bannière de cookies */}
          <CookieConsent />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
