"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string, variantId: string) => void;
  updateQuantity: (
    productId: string,
    variantId: string,
    quantity: number
  ) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getShippingCost: (freeThreshold: number, localCost: number) => number;
  getTotal: (freeThreshold: number, localCost: number) => number;
  hasOnlyDigital: () => boolean;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) =>
              i.productId === newItem.productId &&
              i.variantId === newItem.variantId
          );

          if (existingIndex >= 0) {
            const updatedItems = [...state.items];
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              quantity: updatedItems[existingIndex].quantity + quantity
            };
            return { items: updatedItems };
          }

          return { items: [...state.items, { ...newItem, quantity }] };
        });
      },

      removeItem: (productId, variantId) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.variantId === variantId)
          )
        }));
      },

      updateQuantity: (productId, variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.variantId === variantId
              ? { ...i, quantity }
              : i
          )
        }));
      },

      clearCart: () => set({ items: [] }),

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },

      hasOnlyDigital: () => {
        const items = get().items;
        if (items.length === 0) return false;
        return items.every((item) => item.isDigital);
      },

      getShippingCost: (freeThreshold, localCost) => {
        const items = get().items;
        if (items.length === 0) return 0;
        if (items.every((i) => i.isDigital)) return 0;
        const subtotal = get().getSubtotal();
        return subtotal >= freeThreshold ? 0 : localCost;
      },

      getTotal: (freeThreshold, localCost) => {
        return (
          get().getSubtotal() + get().getShippingCost(freeThreshold, localCost)
        );
      }
    }),
    {
      name: "dnk-cart-storage",
      storage: createJSONStorage(() => localStorage)
    }
  )
);
