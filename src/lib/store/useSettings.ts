"use client";

import { create } from "zustand";
import settingsData from "@/data/settings.json";

interface SettingsState {
  brandName: string;
  currency: string;
  currencySymbol: string;
  shipping: {
    freeThreshold: number;
    localCost: number;
    internationalCost: number;
    bannerText: { fr: string; en: string };
  };
}

export const useSettings = create<SettingsState>(() => ({
  brandName: settingsData.brandName,
  currency: settingsData.currency,
  currencySymbol: settingsData.currencySymbol,
  shipping: settingsData.shipping
}));
