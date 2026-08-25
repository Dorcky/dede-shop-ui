import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DNK Tech — Électronique & Digital",
  description:
    "DNK Tech : smartphones, ordinateurs, audio et produits numériques. Technologies fiables, livraison rapide.",
  keywords: [
    "DNK",
    "tech",
    "électronique",
    "smartphones",
    "ordinateurs",
    "audio"
  ],
  authors: [{ name: "DNK Tech" }]
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Le vrai layout avec la locale est dans [locale]/layout.tsx
  return children;
}
