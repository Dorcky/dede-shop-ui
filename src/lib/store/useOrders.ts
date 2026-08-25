"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Order } from "@/types";

interface OrdersState {
  orders: Order[];
  addOrder: (order: Order) => void;
  getOrdersByUser: (userId: string | null) => Order[];
  getOrderById: (id: string) => Order | undefined;
}

export const useOrders = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],

      addOrder: (order) => {
        set((state) => ({ orders: [order, ...state.orders] }));
      },

      getOrdersByUser: (userId) => {
        return get().orders.filter((o) => o.userId === userId);
      },

      getOrderById: (id) => {
        return get().orders.find((o) => o.id === id);
      }
    }),
    {
      name: "dnk-orders-storage",
      storage: createJSONStorage(() => localStorage)
    }
  )
);
