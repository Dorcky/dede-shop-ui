"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { Search, User, ShoppingCart } from "lucide-react";
import LocaleSwitcher from "./LocaleSwitcher";
import MobileMenu from "./MobileMenu";
import CartDrawer from "@/components/cart/CartDrawer";
import AuthModal from "@/components/auth/AuthModal";
import SearchModal from "@/components/search/SearchModal"; // 👈 import ajouté
import { useCart } from "@/lib/store/useCart";
import { useAuth } from "@/lib/store/useAuth";
import type { Locale } from "@/i18n/routing";

export default function HeaderClientActions({}: { locale: Locale }) {
  const router = useRouter();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false); // 👈 nouveau state
  const [hasMounted, setHasMounted] = useState(false);

  const itemCount = useCart((state) => state.getItemCount());
  const { user, openAuthModal } = useAuth();

  // Évite l'erreur d'hydratation pour le badge du panier
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
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Remplacement du <Link> par un bouton ouvrant la modal */}
        <button
          onClick={() => setIsSearchOpen(true)}
          aria-label="Rechercher"
          className="hidden text-slate-700 hover:text-brand-600 sm:block"
        >
          <Search className="h-5 w-5" />
        </button>

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

      {/* Modales et Drawers */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AuthModal />
      {/* 👈 Intégration de la SearchModal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
