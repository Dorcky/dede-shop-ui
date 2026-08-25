"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User, AuthMode } from "@/types";

interface AuthState {
  user: User | null;
  pendingUser: User | null; // Utilisateur en attente de vérification OTP
  isAuthModalOpen: boolean;
  authMode: AuthMode;
  forgotEmail: string;

  // Actions utilisateur
  setUser: (user: User | null) => void;
  logout: () => void;

  // Actions modale
  openAuthModal: (mode?: AuthMode) => void;
  closeAuthModal: () => void;
  setAuthMode: (mode: AuthMode) => void;
  setForgotEmail: (email: string) => void;

  // Actions inscription
  setPendingUser: (user: User | null) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      pendingUser: null,
      isAuthModalOpen: false,
      authMode: "login",
      forgotEmail: "",

      setUser: (user) => set({ user, pendingUser: null }),
      logout: () => set({ user: null }),

      openAuthModal: (mode = "login") =>
        set({ isAuthModalOpen: true, authMode: mode }),
      closeAuthModal: () =>
        set({ isAuthModalOpen: false, pendingUser: null, forgotEmail: "" }),
      setAuthMode: (mode) => set({ authMode: mode }),
      setForgotEmail: (email) => set({ forgotEmail: email }),

      setPendingUser: (user) => set({ pendingUser: user })
    }),
    {
      name: "dnk-auth-storage",
      storage: createJSONStorage(() => localStorage),
      // Ne persiste que l'utilisateur, pas l'état de la modale
      partialize: (state) => ({ user: state.user })
    }
  )
);
