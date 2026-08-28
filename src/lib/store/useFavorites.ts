"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface FavoriteItem {
  productId: string;
  slug: string;
  name: { fr: string; en: string };
  price: number;
  oldPrice?: number;
  image: string;
  brand?: string;
}

interface FavoritesState {
  items: FavoriteItem[];
  addItem: (item: FavoriteItem) => void;
  removeItem: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  clearFavorites: () => void;
}

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        if (!get().isFavorite(item.productId)) {
          set((state) => ({ items: [item, ...state.items] }));
        }
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId)
        }));
      },

      isFavorite: (productId) => {
        return get().items.some((item) => item.productId === productId);
      },

      clearFavorites: () => set({ items: [] })
    }),
    {
      name: "dnk-favorites-storage",
      storage: createJSONStorage(() => localStorage)
    }
  )
);
