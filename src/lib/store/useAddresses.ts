"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Address {
  id: string;
  country: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
  propertyType?: "house" | "apartment" | "business" | "other";
  securityCode?: string;
  callBox?: string;
  keyFobRequired?: boolean;
  leavePackageLocation?:
    "front_door" | "reception" | "mailroom" | "no_preference";
  deliveryNotes?: string;
}

interface AddressesState {
  addresses: Address[];
  // ✅ CORRECTION : On omet seulement "id" (généré automatiquement), mais on garde "isDefault"
  addAddress: (address: Omit<Address, "id">) => void;
  updateAddress: (id: string, data: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

export const useAddresses = create<AddressesState>()(
  persist(
    (set, get) => ({
      addresses: [],
      addAddress: (data) => {
        // Si c'est la première adresse, ou si l'utilisateur coche "par défaut"
        const isDefault = get().addresses.length === 0 || data.isDefault;
        set((state) => ({
          addresses: [
            ...state.addresses,
            { ...data, id: `addr-${Date.now()}`, isDefault }
          ]
        }));
      },
      updateAddress: (id, data) => {
        set((state) => ({
          addresses: state.addresses.map((addr) =>
            addr.id === id ? { ...addr, ...data } : addr
          )
        }));
      },
      deleteAddress: (id) => {
        set((state) => ({
          addresses: state.addresses.filter((addr) => addr.id !== id)
        }));
      },
      setDefaultAddress: (id) => {
        set((state) => ({
          addresses: state.addresses.map((addr) => ({
            ...addr,
            isDefault: addr.id === id
          }))
        }));
      }
    }),
    {
      name: "dnk-addresses-storage",
      storage: createJSONStorage(() => localStorage)
    }
  )
);
