# 🚀 Plan de migration DNK Tech → Next.js modulaire

Voici la feuille de route complète, découpée en **sprints** progressifs, sans code, pour transformer votre maquette monolithique en une application Next.js professionnelle, modulaire et pilotée par des fichiers JSON.

---

## 🏗️ Architecture globale proposée

```
dnk-tech/
├── src/
│   ├── app/                    # App Router (pages)
│   │   ├── [locale]/           # i18n : /fr/..., /en/...
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx        # Home
│   │   │   ├── shop/
│   │   │   ├── product/[slug]/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   ├── account/
│   │   │   ├── about/
│   │   │   ├── contact/
│   │   │   └── returns/
│   │   ├── api/                # API routes (fetch JSON → REST)
│   │   │   ├── products/
│   │   │   ├── categories/
│   │   │   ├── orders/
│   │   │   ├── reviews/
│   │   │   ├── complaints/
│   │   │   ├── contact/
│   │   │   └── auth/
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                 # Boutons, inputs, badges, modals...
│   │   ├── layout/             # Header, Footer, Banner, MobileMenu
│   │   ├── product/            # ProductCard, Gallery, Specs, Reviews
│   │   ├── cart/               # CartDrawer, CartItem, CartSummary
│   │   ├── checkout/           # CheckoutForm, OrderSummary
│   │   ├── account/            # OrderRow, OrderDetail, AuthForms
│   │   └── shared/             # Toast, SearchModal, ComplaintModal
│   ├── lib/
│   │   ├── db/                 # Fetchers JSON (products, orders...)
│   │   ├── utils/              # money(), t(), stars(), escapeHtml()
│   │   ├── i18n/               # Configuration next-intl
│   │   └── store/              # Zustand (cart, user, UI state)
│   ├── data/                   # ⭐ JSON = "base de données"
│   │   ├── products.json
│   │   ├── categories.json
│   │   ├── product-types.json
│   │   ├── orders.json
│   │   ├── reviews.json
│   │   ├── translations/
│   │   │   ├── fr.json
│   │   │   └── en.json
│   │   ├── settings.json
│   │   ├── shipping.json
│   │   ├── home.json
│   │   ├── about.json
│   │   ├── contact.json
│   │   ├── returns.json
│   │   └── footer.json
│   ├── hooks/                  # useCart, useAuth, useLanguage...
│   └── types/                  # TypeScript interfaces
├── public/                     # Images, fonts
├── next.config.js
├── tailwind.config.ts
└── package.json
```

---

## 📦 Stratégie "JSON comme base de données"

- **Lecture** : `data/*.json` → exposés via des **API Routes** (`/api/products`, `/api/orders`…)
- **Écriture** : mutations via API routes qui écrivent dans les JSON (ou migration future vers Prisma/SQLite sans changer le front)
- **Traductions** : `data/translations/{locale}.json` chargées par `next-intl`
- **Avantage** : le front ne sait pas d'où viennent les données → migration transparente vers une vraie DB plus tard

---

## 🏃 Sprints de réalisation UI

### 🟦 Sprint 0 — Fondations & configuration (2 jours)

**Objectif** : socle technique propre

- Initialisation Next.js (App Router + TypeScript + Tailwind)
- Configuration ESLint, Prettier, Husky
- Installation : `next-intl`, `zustand`, `lucide-react`, `sonner` (toasts)
- Mise en place du routing `[locale]` (FR / EN)
- Variables Tailwind (couleurs `brand`, typo, animations)
- Structure de dossiers finalisée

**Livrable** : app qui démarre, route `/fr` et `/en` fonctionnelles.

---

### 🟦 Sprint 1 — Couche "JSON DB" & fetchers (2 jours)

**Objectif** : isoler la donnée du UI

- Création de tous les fichiers JSON (products, categories, translations, settings…)
- Fetchers typés dans `lib/db/` (`getProducts()`, `getProductBySlug()`, `getCategories()`…)
- API Routes REST (`/api/products`, `/api/products/[slug]`, `/api/categories`…)
- Hook générique `useApi()`
- Tests manuels via `curl` / Postman

**Livrable** : données accessibles via API, indépendantes du UI.

---

### 🟦 Sprint 2 — Layout global & navigation (3 jours)

**Objectif** : squelette réutilisable

- `RootLayout` + `LocaleLayout`
- **Header** : sticky, banner promo, logo DNK, nav desktop, menu mobile
- **Footer** : 4 colonnes, newsletter, copyright
- **Composants UI de base** : Button, Input, Select, Badge, Modal, Drawer
- Système de **traductions** via `next-intl` (chargement des JSON)
- Switch de langue FR/EN
- Toast global (via `sonner`)

**Livrable** : layout complet, navigation fonctionnelle, i18n opérationnel.

---

### 🟦 Sprint 3 — Page d'accueil (2 jours)

**Objectif** : vitrine DNK Tech

- Hero section (image de fond, CTA)
- Bande de logos partenaires
- Grille des catégories (fetch depuis `/api/categories`)
- Section "Produits populaires" (fetch `/api/products?featured=true`)
- Bloc offre spéciale
- Section avantages (4 icônes)

**Livrable** : home complète, 100 % pilotée par JSON.

---

### 🟦 Sprint 4 — Boutique & filtres (3 jours)

**Objectif** : catalogue dynamique

- Page `/shop` avec grille produits
- Barre de filtres : recherche, catégorie, type, tri
- `ProductCard` réutilisable (image, badge, prix, stock, note)
- Pagination ou infinite scroll
- États vides (aucun résultat)
- URL synchronisée avec filtres (`?category=smartphones&sort=priceAsc`)

**Livrable** : boutique navigable, filtres fonctionnels.

---

### 🟦 Sprint 5 — Fiche produit (3 jours)

**Objectif** : page produit riche

- Galerie d'images + miniatures (variantes)
- Sélecteur de variantes (couleur, etc.)
- Prix, ancien prix, badge stock, garantie
- Description en blocs (paragraphes + images)
- Tableau de spécifications techniques
- Section "Souvent achetés ensemble"
- Section "Produits similaires"
- Bloc avis clients (liste + note globale)
- Bouton "Ajouter au panier"

**Livrable** : fiche produit complète, route `/product/[slug]`.

---

### 🟦 Sprint 6 — Panier (2 jours)

**Objectif** : gestion du panier

- Store Zustand `useCart` (persisté en `localStorage`)
- **CartDrawer** (latéral droit)
- Page `/cart` complète avec résumé
- Calcul livraison (gratuite dès 100 $)
- Gestion produits numériques (pas de livraison)
- Boutons +/-, supprimer

**Livrable** : panier fonctionnel, drawer + page.

---

### 🟦 Sprint 7 — Checkout (3 jours)

**Objectif** : tunnel d'achat

- Formulaire contact (nom, email, téléphone)
- Adresse de livraison (masquée si 100 % numérique)
- Formulaire paiement (simulation)
- Résumé commande (aside)
- Validation formulaire (Zod + React Hook Form)
- Confirmation → création commande (POST `/api/orders`)
- Redirection vers `/account`

**Livrable** : checkout complet, commande persistée.

---

### 🟦 Sprint 8 — Authentification (3 jours)

**Objectif** : comptes utilisateurs

- Modale Auth (login / register / verify / forgot / reset)
- Store Zustand `useAuth`
- API routes `/api/auth/*` (simulation)
- Vérification email par OTP (démo : 123456)
- Persistance session (cookie ou localStorage)
- Guest checkout autorisé

**Livrable** : auth complète, session persistée.

---

### 🟦 Sprint 9 — Espace client & commandes (2 jours)

**Objectif** : tableau de bord

- Page `/account` (salutation, déconnexion)
- Liste des commandes (fetch `/api/orders?userId=...`)
- Détail commande (modale) avec suivi de livraison
- Bouton "Demander un retour" depuis une commande
- Sidebar : réclamations, retours, contact

**Livrable** : espace client complet.

---

### 🟦 Sprint 10 — Pages statiques (2 jours)

**Objectif** : contenu éditorial

- `/about` : mission, valeurs, CTA
- `/contact` : formulaire + infos (envoi via `/api/contact`)
- `/returns` : politique + formulaire de retour
- Contenu 100 % piloté par JSON (`about.json`, `contact.json`, `returns.json`)

**Livrable** : 3 pages statiques traduisibles.

---

### 🟦 Sprint 11 — Modales & interactions avancées (2 jours)

**Objectif** : fonctionnalités transverses

- **SearchModal** (recherche globale → redirige vers `/shop?search=...`)
- **ComplaintModal** (réclamation)
- **ReviewForm** (ajout d'avis + upload d'images, max 5)
- **OrderDetailModal** (suivi étape par étape)
- Gestion des images d'avis (preview + suppression)

**Livrable** : toutes les modales du projet initial.

---

### 🟦 Sprint 12 — Notifications & feedback (1 jour)

**Objectif** : UX fluide

- Toasts (succès, erreur, info) via `sonner`
- Messages de confirmation (newsletter, contact, avis, réclamation)
- États de chargement (skeletons sur ProductCard, Shop)
- Gestion des erreurs API

**Livrable** : feedback utilisateur complet.

---

### 🟦 Sprint 13 — SEO, performance & accessibilité (2 jours)

**Objectif** : production-ready

- `metadata` dynamique par page (title, description, OG)
- `generateStaticParams` pour `/product/[slug]`
- Images optimisées (`next/image`)
- Lazy loading, code splitting
- Audit accessibilité (ARIA, focus, contrastes)
- Responsive final (mobile, tablette, desktop)

**Livrable** : app optimisée, accessible, SEO-friendly.

---

### 🟦 Sprint 14 — Tests & déploiement (2 jours)

**Objectif** : mise en production

- Tests unitaires (Vitest) sur fetchers et utils
- Tests composants (React Testing Library)
- Tests E2E critiques (Vitest + Playwright) : achat complet
- Configuration `next.config.js` (i18n, images)
- Déploiement Vercel (ou Docker)
- README complet

**Livrable** : app déployée, documentée, testée.

---

## 📊 Récapitulatif

| Sprint | Durée | Thème               |
| ------ | ----- | ------------------- |
| 0      | 2j    | Fondations          |
| 1      | 2j    | JSON DB & fetchers  |
| 2      | 3j    | Layout & i18n       |
| 3      | 2j    | Home                |
| 4      | 3j    | Shop                |
| 5      | 3j    | Fiche produit       |
| 6      | 2j    | Panier              |
| 7      | 3j    | Checkout            |
| 8      | 3j    | Auth                |
| 9      | 2j    | Compte client       |
| 10     | 2j    | Pages statiques     |
| 11     | 2j    | Modales             |
| 12     | 1j    | Notifications       |
| 13     | 2j    | SEO & perf          |
| 14     | 2j    | Tests & déploiement |

**Total estimé : ~31 jours ouvrés** (≈ 6 semaines) pour un développeur seul.

---

## ✅ Recommandations stratégiques

1. **Commencez toujours par le Sprint 1** : la couche JSON/API est le cœur du projet. Tout le reste en dépend.
2. **Un composant = un fichier** : respectez la règle "dumb component" (UI) vs "smart component" (data).
3. **TypeScript strict** dès le Sprint 0 : vous éviterez 80 % des bugs.
4. **next-intl plutôt que i18next** : mieux intégré à l'App Router.
5. **Zustand plutôt que Context** : plus simple pour le panier et l'auth.
6. **Migration future facile** : quand vous passerez à Prisma/PostgreSQL, seul `lib/db/` changera.

---

Souhaitez-vous que je détaille un sprint en particulier (arborescence exacte, liste des composants, contrats d'API JSON) ou que je commence par le **Sprint 0** avec la configuration complète ?
