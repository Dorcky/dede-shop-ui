import "./globals.css";

// ✅ Suppression totale des métadonnées en dur.
// Elles sont déjà gérées de manière dynamique et traduite dans [locale]/layout.tsx

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Ce layout sert uniquement de point d'entrée pour le CSS global.
  // Le vrai rendu HTML (avec <html> et <body>) se fait dans [locale]/layout.tsx
  return children;
}
