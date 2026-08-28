"use client";

import { useState } from "react";
import SearchModal from "./SearchModal";
import { Search } from "lucide-react";

export default function MobileSearchBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex w-full items-center gap-3 rounded-none border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-500 shadow-sm transition-all hover:border-brand-600 hover:text-brand-600 hover:shadow-md active:scale-[0.99]"
        aria-label="Ouvrir la recherche"
      >
        <Search className="h-5 w-5 shrink-0" />
        <span className="flex-1 text-left">Rechercher un produit...</span>
      </button>

      <SearchModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
