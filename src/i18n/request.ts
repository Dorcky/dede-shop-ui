import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import type { Locale } from "./routing"; // ✅ Ajoutez cet import

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as Locale)) {
    // ✅ Remplacez 'any'
    locale = routing.defaultLocale;
  }

  return {
    locale,
    // Chargement des messages de traduction pour la locale active
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
