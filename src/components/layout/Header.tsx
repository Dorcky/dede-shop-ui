"use client";

import { useState, useEffect } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Search, User, ShoppingCart } from "lucide-react";
import LocaleSwitcher from "./LocaleSwitcher";
import MobileMenu from "./MobileMenu";
import CartDrawer from "@/components/cart/CartDrawer";
import AuthModal from "@/components/auth/AuthModal";
import { useCart } from "@/lib/store/useCart";
import { useSettings } from "@/lib/store/useSettings";
import { useAuth } from "@/lib/store/useAuth";
import type { Locale } from "@/i18n/routing";

export default function Header({ locale }: { locale: Locale }) {
  const t = useTranslations("nav");
  const router = useRouter();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false); // ✅ État pour éviter l'erreur d'hydratation

  const itemCount = useCart((state) => state.getItemCount());
  const settings = useSettings();
  const { user, openAuthModal } = useAuth();
  const bannerText = settings.shipping.bannerText[locale];

  // ✅ On passe hasMounted à true uniquement côté client, après le montage
  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleAccountClick = () => {
    if (user) {
      router.push("/account");
    } else {
      openAuthModal("login");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
        <div className="bg-brand-900 px-4 py-2 text-center text-xs font-medium text-white">
          {bannerText}
        </div>

        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
          <Link
            href="/"
            className="text-2xl font-black tracking-[.25em] text-slate-900"
          >
            DNK TECH
          </Link>

          <div className="hidden items-center gap-7 text-xs font-bold uppercase tracking-wider lg:flex">
            <Link href="/shop" className="hover:text-brand-600">
              {t("all")}
            </Link>
            <Link
              href="/shop?category=smartphones"
              className="hover:text-brand-600"
            >
              {t("smartphones")}
            </Link>
            <Link
              href="/shop?category=laptops"
              className="hover:text-brand-600"
            >
              {t("laptops")}
            </Link>
            <Link href="/shop?category=audio" className="hover:text-brand-600">
              {t("audio")}
            </Link>
            <Link
              href="/shop?category=digital"
              className="hover:text-brand-600"
            >
              {t("digital")}
            </Link>
            <Link href="/about" className="hover:text-brand-600">
              {t("about")}
            </Link>
            <Link href="/contact" className="hover:text-brand-600">
              {t("contact")}
            </Link>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/shop"
              aria-label="Rechercher"
              className="hidden text-slate-700 hover:text-brand-600 sm:block"
            >
              <Search className="h-5 w-5" />
            </Link>

            <button
              onClick={handleAccountClick}
              aria-label="Compte"
              className="text-slate-700 hover:text-brand-600"
            >
              <User className="h-5 w-5" />
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Panier"
              className="relative text-slate-700 hover:text-brand-600"
            >
              <ShoppingCart className="h-5 w-5" />
              {/* ✅ Le badge ne s'affiche que si le composant est monté côté client ET qu'il y a des articles */}
              {hasMounted && itemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </button>

            <div className="hidden lg:block">
              <LocaleSwitcher />
            </div>

            <MobileMenu />
          </div>
        </nav>
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AuthModal />
    </>
  );
}
