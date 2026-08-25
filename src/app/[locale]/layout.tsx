import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
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

export const metadata: Metadata = {
  title: "DNK Tech — Électronique & Digital",
  description:
    "DNK Tech : smartphones, ordinateurs, audio et produits numériques."
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    // ✅ Remplacez 'any'
    notFound();
  }
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 text-slate-800 antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header locale={locale} />
          <main className="min-h-[60vh]">{children}</main>
          <Footer locale={locale} />

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
