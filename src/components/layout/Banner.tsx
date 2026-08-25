import { getSettings } from "@/lib/db";
import { Locale } from "@/i18n/routing";

export default async function Banner({ locale }: { locale: Locale }) {
  const settings = await getSettings();
  const bannerText = settings.shipping.bannerText[locale];

  return (
    <div className="bg-brand-900 px-4 py-2 text-center text-xs font-medium text-white">
      {bannerText}
    </div>
  );
}
