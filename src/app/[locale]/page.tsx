import { Locale } from "@/i18n/routing";
import HeroSection from "@/components/home/HeroSection";
import BrandsBand from "@/components/home/BrandsBand";
import CategoriesGrid from "@/components/home/CategoriesGrid";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import SpecialOffer from "@/components/home/SpecialOffer";
import BenefitsSection from "@/components/home/BenefitsSection";

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: Locale }>;
}) {
  // Next.js 15 : params est une Promise
  const { locale } = await params;

  return (
    <>
      <HeroSection />
      <BrandsBand />
      <CategoriesGrid locale={locale} />
      <FeaturedProducts locale={locale} />
      <SpecialOffer />
      <BenefitsSection />
    </>
  );
}
