====================================================================================================
🌳 ANALYSE DE L'ARBORESCENCE AVEC DÉPENDANCES
====================================================================================================

📂 Répertoire : F:\dede-shop
📊 Mode détaillé : Activé

────────────────────────────────────────────────────────────────────────────────────────────────────

Légende :
📁 = Dossier
🐍 = Fichier Python
📜 = Fichier JavaScript/TypeScript
📄 = Autre fichier
📊 = Statistiques d'imports
📦 = Liste des dépendances

────────────────────────────────────────────────────────────────────────────────────────────────────

├── 📄 AGENTS.md
├── 📄 CLAUDE.md
├── 📄 README.md
├── 📄 dede-doc.txt
├── 📁 doc/
│ ├── 📄 arborescence.md
│ └── 📁 checkout/
│ ├── 📄 admin.html
│ └── 📄 client.html
├── 📜 eslint.config.mjs
│ ├─ 📊 Imports: 3 total (0 locaux)
│ └─ 📦 Dépendances:
│ ├─ url
│ ├─ @eslint/eslintrc
│ └─ path
├── 📄 git.md
├── 📁 messages/
│ ├── 📄 common.json
│ ├── 📄 en.json
│ └── 📄 fr.json
├── 📜 next-env.d.ts
├── 📜 next.config.ts
│ ├─ 📊 Imports: 2 total (0 locaux)
│ └─ 📦 Dépendances:
│ ├─ next
│ └─ next-intl/plugin
├── 📄 package-lock.json
├── 📄 package.json
├── 📜 postcss.config.mjs
│ ├─ 📊 Imports: 1 total (0 locaux)
│ └─ 📦 Dépendances:
│ └─ postcss-load-config
├── 📁 public/
│ ├── 📄 file.svg
│ ├── 📄 globe.svg
│ ├── 📄 next.svg
│ ├── 📄 vercel.svg
│ └── 📄 window.svg
├── 📄 sprint.md
├── 📁 src/
│ ├── 📁 app/
│ │ ├── 📁 [locale]/
│ │ │ ├── 📁 [...rest]/
│ │ │ │ └── 📜 page.tsx
│ │ │ │ ├─ 📊 Imports: 1 total (0 locaux)
│ │ │ │ └─ 📦 Dépendances:
│ │ │ │ └─ next/navigation
│ │ │ ├── 📁 about/
│ │ │ │ └── 📜 page.tsx
│ │ │ │ ├─ 📊 Imports: 5 total (0 locaux)
│ │ │ │ └─ 📦 Dépendances:
│ │ │ │ ├─ @/i18n/navigation
│ │ │ │ ├─ @/lib/db
│ │ │ │ ├─ @/i18n/routing
│ │ │ │ ├─ next/image
│ │ │ │ └─ next-intl/server
│ │ │ ├── 📁 account/
│ │ │ │ └── 📜 page.tsx
│ │ │ │ ├─ 📊 Imports: 15 total (0 locaux)
│ │ │ │ └─ 📦 Dépendances:
│ │ │ │ ├─ next/navigation
│ │ │ │ ├─ @/i18n/navigation
│ │ │ │ ├─ @/components/order/OrderDetailModal
│ │ │ │ ├─ sonner
│ │ │ │ ├─ react
│ │ │ │ ├─ @/lib/store/useAuth
│ │ │ │ ├─ @/lib/store/useOrders
│ │ │ │ ├─ @/types
│ │ │ │ ├─ @/components/account/FavoritesList
│ │ │ │ └─ @/components/account/AccountSidebar
│ │ │ ├── 📁 cart/
│ │ │ │ └── 📜 page.tsx
│ │ │ │ ├─ 📊 Imports: 6 total (0 locaux)
│ │ │ │ └─ 📦 Dépendances:
│ │ │ │ ├─ @/i18n/navigation
│ │ │ │ ├─ @/lib/store/useCart
│ │ │ │ ├─ @/lib/store/useSettings
│ │ │ │ ├─ next-intl
│ │ │ │ ├─ lucide-react
│ │ │ │ └─ next/image
│ │ │ ├── 📁 checkout/
│ │ │ │ └── 📜 page.tsx
│ │ │ │ ├─ 📊 Imports: 8 total (0 locaux)
│ │ │ │ └─ 📦 Dépendances:
│ │ │ │ ├─ @/i18n/navigation
│ │ │ │ ├─ @/components/checkout/CheckoutForm
│ │ │ │ ├─ @/lib/store/useCart
│ │ │ │ ├─ lucide-react
│ │ │ │ ├─ react
│ │ │ │ ├─ @/types
│ │ │ │ ├─ next-intl
│ │ │ │ └─ @/components/checkout/OrderSummary
│ │ │ ├── 📁 contact/
│ │ │ │ └── 📜 page.tsx
│ │ │ │ ├─ 📊 Imports: 3 total (0 locaux)
│ │ │ │ └─ 📦 Dépendances:
│ │ │ │ ├─ @/components/contact/ContactForm
│ │ │ │ ├─ @/i18n/routing
│ │ │ │ └─ @/lib/db
│ │ │ ├── 📜 error.tsx
│ │ │ │ ├─ 📊 Imports: 4 total (0 locaux)
│ │ │ │ └─ 📦 Dépendances:
│ │ │ │ ├─ next-intl
│ │ │ │ ├─ react
│ │ │ │ ├─ @/components/ui/Button
│ │ │ │ └─ lucide-react
│ │ │ ├── 📜 layout.tsx
│ │ │ │ ├─ 📊 Imports: 9 total (0 locaux)
│ │ │ │ └─ 📦 Dépendances:
│ │ │ │ ├─ next/navigation
│ │ │ │ ├─ sonner
│ │ │ │ ├─ @/components/shared/CookieConsent
│ │ │ │ ├─ @/components/layout/Header
│ │ │ │ ├─ @/components/layout/Footer
│ │ │ │ ├─ next
│ │ │ │ ├─ @/i18n/routing
│ │ │ │ ├─ next-intl
│ │ │ │ └─ next-intl/server
│ │ │ ├── 📜 loading.tsx
│ │ │ │ ├─ 📊 Imports: 1 total (0 locaux)
│ │ │ │ └─ 📦 Dépendances:
│ │ │ │ └─ @/components/ui/Skeleton
│ │ │ ├── 📜 not-found.tsx
│ │ │ │ ├─ 📊 Imports: 3 total (0 locaux)
│ │ │ │ └─ 📦 Dépendances:
│ │ │ │ ├─ lucide-react
│ │ │ │ ├─ next-intl
│ │ │ │ └─ @/i18n/navigation
│ │ │ ├── 📜 page.tsx
│ │ │ │ ├─ 📊 Imports: 7 total (0 locaux)
│ │ │ │ └─ 📦 Dépendances:
│ │ │ │ ├─ @/components/home/BrandsBand
│ │ │ │ ├─ @/components/home/BenefitsSection
│ │ │ │ ├─ @/components/home/HeroSection
│ │ │ │ ├─ @/components/home/FeaturedProducts
│ │ │ │ ├─ @/i18n/routing
│ │ │ │ ├─ @/components/home/SpecialOffer
│ │ │ │ └─ @/components/home/CategoriesGrid
│ │ │ ├── 📁 product/
│ │ │ │ └── 📁 [slug]/
│ │ │ │ └── 📜 page.tsx
│ │ │ │ ├─ 📊 Imports: 10 total (0 locaux)
│ │ │ │ └─ 📦 Dépendances:
│ │ │ │ ├─ next/navigation
│ │ │ │ ├─ @/i18n/navigation
│ │ │ │ ├─ @/lib/db
│ │ │ │ ├─ @/components/product/ProductDescription
│ │ │ │ ├─ @/components/product/ProductSpecs
│ │ │ │ ├─ @/components/product/ProductReviews
│ │ │ │ ├─ @/components/product/RelatedProducts
│ │ │ │ ├─ @/components/product/ProductDetailTop
│ │ │ │ ├─ @/i18n/routing
│ │ │ │ └─ next-intl/server
│ │ │ ├── 📁 returns/
│ │ │ │ └── 📜 page.tsx
│ │ │ │ ├─ 📊 Imports: 3 total (0 locaux)
│ │ │ │ └─ 📦 Dépendances:
│ │ │ │ ├─ @/components/returns/ReturnsForm
│ │ │ │ ├─ @/i18n/routing
│ │ │ │ └─ @/lib/db
│ │ │ └── 📁 shop/
│ │ │ └── 📜 page.tsx
│ │ │ ├─ 📊 Imports: 5 total (0 locaux)
│ │ │ └─ 📦 Dépendances:
│ │ │ ├─ @/lib/db
│ │ │ ├─ @/components/product/ProductCard
│ │ │ ├─ @/i18n/routing
│ │ │ ├─ @/components/shop/ShopFilters
│ │ │ └─ next-intl/server
│ │ ├── 📁 api/
│ │ │ ├── 📁 categories/
│ │ │ │ └── 📜 route.ts
│ │ │ │ ├─ 📊 Imports: 2 total (0 locaux)
│ │ │ │ └─ 📦 Dépendances:
│ │ │ │ ├─ @/lib/db
│ │ │ │ └─ next/server
│ │ │ ├── 📁 complaints/
│ │ │ │ └── 📜 route.ts
│ │ │ │ ├─ 📊 Imports: 4 total (0 locaux)
│ │ │ │ └─ 📦 Dépendances:
│ │ │ │ ├─ path
│ │ │ │ ├─ fs/promises
│ │ │ │ ├─ @/types
│ │ │ │ └─ next/server
│ │ │ ├── 📁 contact/
│ │ │ │ └── 📜 route.ts
│ │ │ │ ├─ 📊 Imports: 4 total (0 locaux)
│ │ │ │ └─ 📦 Dépendances:
│ │ │ │ ├─ path
│ │ │ │ ├─ fs/promises
│ │ │ │ ├─ @/types
│ │ │ │ └─ next/server
│ │ │ ├── 📁 orders/
│ │ │ │ └── 📜 route.ts
│ │ │ │ ├─ 📊 Imports: 4 total (0 locaux)
│ │ │ │ └─ 📦 Dépendances:
│ │ │ │ ├─ path
│ │ │ │ ├─ fs/promises
│ │ │ │ ├─ @/types
│ │ │ │ └─ next/server
│ │ │ ├── 📁 products/
│ │ │ │ ├── 📁 [slug]/
│ │ │ │ │ └── 📜 route.ts
│ │ │ │ │ ├─ 📊 Imports: 2 total (0 locaux)
│ │ │ │ │ └─ 📦 Dépendances:
│ │ │ │ │ ├─ @/lib/db
│ │ │ │ │ └─ next/server
│ │ │ │ └── 📜 route.ts
│ │ │ │ ├─ 📊 Imports: 2 total (0 locaux)
│ │ │ │ └─ 📦 Dépendances:
│ │ │ │ ├─ @/lib/db
│ │ │ │ └─ next/server
│ │ │ └── 📁 taxes/
│ │ │ └── 📜 route.ts
│ │ │ ├─ 📊 Imports: 3 total (0 locaux)
│ │ │ └─ 📦 Dépendances:
│ │ │ ├─ @/data/taxes.json
│ │ │ ├─ @/types
│ │ │ └─ next/server
│ │ ├── 📄 favicon.ico
│ │ ├── 📄 globals.css
│ │ ├── 📜 globals.css.d.ts
│ │ ├── 📄 index.css
│ │ └── 📜 layout.tsx
│ ├── 📁 components/
│ │ ├── 📁 account/
│ │ │ ├── 📜 AccountSidebar.tsx
│ │ │ │ ├─ 📊 Imports: 3 total (0 locaux)
│ │ │ │ └─ 📦 Dépendances:
│ │ │ │ ├─ next-intl
│ │ │ │ ├─ @/i18n/navigation
│ │ │ │ └─ @/types
│ │ │ ├── 📜 AddressManager.tsx
│ │ │ │ ├─ 📊 Imports: 4 total (0 locaux)
│ │ │ │ └─ 📦 Dépendances:
│ │ │ │ ├─ next-intl
│ │ │ │ ├─ react
│ │ │ │ ├─ @/lib/store/useAddresses
│ │ │ │ └─ sonner
│ │ │ ├── 📜 FavoritesList.tsx
│ │ │ │ ├─ 📊 Imports: 7 total (0 locaux)
│ │ │ │ └─ 📦 Dépendances:
│ │ │ │ ├─ @/i18n/navigation
│ │ │ │ ├─ sonner
│ │ │ │ ├─ @/lib/utils
│ │ │ │ ├─ next-intl
│ │ │ │ ├─ lucide-react
│ │ │ │ ├─ next/image
│ │ │ │ └─ @/lib/store/useFavorites
│ │ │ └── 📜 SecurityManager.tsx
│ │ │ ├─ 📊 Imports: 7 total (0 locaux)
│ │ │ └─ 📦 Dépendances:
│ │ │ ├─ @/i18n/navigation
│ │ │ ├─ sonner
│ │ │ ├─ lucide-react
│ │ │ ├─ react
│ │ │ ├─ @/lib/store/useAuth
│ │ │ ├─ @/types
│ │ │ └─ next-intl
│ │ ├── 📁 auth/
│ │ │ ├── 📜 AuthModal.tsx
│ │ │ │ ├─ 📊 Imports: 8 total (0 locaux)
│ │ │ │ └─ 📦 Dépendances:
│ │ │ │ ├─ @/i18n/navigation
│ │ │ │ ├─ sonner
│ │ │ │ ├─ lucide-react
│ │ │ │ ├─ react
│ │ │ │ ├─ @/lib/store/useAuth
│ │ │ │ ├─ @/types
│ │ │ │ ├─ react-dom
│ │ │ │ └─ next-intl
│ │ │ └── 📄 test-ui.txt
│ │ ├── 📁 cart/
│ │ │ └── 📜 CartDrawer.tsx
│ │ │ ├─ 📊 Imports: 7 total (0 locaux)
│ │ │ └─ 📦 Dépendances:
│ │ │ ├─ @/i18n/navigation
│ │ │ ├─ @/lib/store/useCart
│ │ │ ├─ lucide-react
│ │ │ ├─ react
│ │ │ ├─ @/lib/store/useSettings
│ │ │ ├─ next-intl
│ │ │ └─ next/image
│ │ ├── 📁 checkout/
│ │ │ ├── 📜 CheckoutForm.tsx
│ │ │ │ ├─ 📊 Imports: 14 total (0 locaux)
│ │ │ │ └─ 📦 Dépendances:
│ │ │ │ ├─ react-hook-form
│ │ │ │ ├─ @/i18n/navigation
│ │ │ │ ├─ zod
│ │ │ │ ├─ @/lib/store/useCart
│ │ │ │ ├─ sonner
│ │ │ │ ├─ lucide-react
│ │ │ │ ├─ react
│ │ │ │ ├─ @hookform/resolvers/zod
│ │ │ │ ├─ @/lib/store/useOrders
│ │ │ │ └─ @/lib/store/useAuth
│ │ │ └── 📜 OrderSummary.tsx
│ │ │ ├─ 📊 Imports: 5 total (0 locaux)
│ │ │ └─ 📦 Dépendances:
│ │ │ ├─ @/lib/store/useCart
│ │ │ ├─ @/types
│ │ │ ├─ @/lib/utils
│ │ │ ├─ next-intl
│ │ │ └─ next/image
│ │ ├── 📁 complaint/
│ │ │ └── 📜 ComplaintModal.tsx
│ │ │ ├─ 📊 Imports: 5 total (0 locaux)
│ │ │ └─ 📦 Dépendances:
│ │ │ ├─ sonner
│ │ │ ├─ lucide-react
│ │ │ ├─ react
│ │ │ ├─ @/lib/store/useAuth
│ │ │ └─ next-intl
│ │ ├── 📁 contact/
│ │ │ └── 📜 ContactForm.tsx
│ │ │ ├─ 📊 Imports: 5 total (0 locaux)
│ │ │ └─ 📦 Dépendances:
│ │ │ ├─ sonner
│ │ │ ├─ react
│ │ │ ├─ @/lib/store/useAuth
│ │ │ ├─ @/types
│ │ │ └─ next-intl
│ │ ├── 📁 home/
│ │ │ ├── 📜 BenefitsSection.tsx
│ │ │ │ ├─ 📊 Imports: 2 total (0 locaux)
│ │ │ │ └─ 📦 Dépendances:
│ │ │ │ ├─ lucide-react
│ │ │ │ └─ next-intl
│ │ │ ├── 📜 BrandsBand.tsx
│ │ │ │ ├─ 📊 Imports: 2 total (0 locaux)
│ │ │ │ └─ 📦 Dépendances:
│ │ │ │ ├─ next-intl
│ │ │ │ └─ @/data/brands
│ │ │ ├── 📜 CategoriesGrid.tsx
│ │ │ │ ├─ 📊 Imports: 5 total (0 locaux)
│ │ │ │ └─ 📦 Dépendances:
│ │ │ │ ├─ @/i18n/navigation
│ │ │ │ ├─ @/lib/db
│ │ │ │ ├─ @/i18n/routing
│ │ │ │ ├─ next/image
│ │ │ │ └─ next-intl/server
│ │ │ ├── 📜 FeaturedProducts.tsx
│ │ │ │ ├─ 📊 Imports: 5 total (0 locaux)
│ │ │ │ └─ 📦 Dépendances:
│ │ │ │ ├─ @/i18n/navigation
│ │ │ │ ├─ @/lib/db
│ │ │ │ ├─ @/components/product/ProductCard
│ │ │ │ ├─ @/i18n/routing
│ │ │ │ └─ next-intl/server
│ │ │ ├── 📜 HeroSection.tsx
│ │ │ │ ├─ 📊 Imports: 3 total (0 locaux)
│ │ │ │ └─ 📦 Dépendances:
│ │ │ │ ├─ next-intl
│ │ │ │ ├─ next/image
│ │ │ │ └─ @/i18n/navigation
│ │ │ └── 📜 SpecialOffer.tsx
│ │ │ ├─ 📊 Imports: 3 total (0 locaux)
│ │ │ └─ 📦 Dépendances:
│ │ │ ├─ next-intl
│ │ │ ├─ next/image
│ │ │ └─ @/i18n/navigation
│ │ ├── 📁 layout/
│ │ │ ├── 📜 Banner.tsx
│ │ │ │ ├─ 📊 Imports: 2 total (0 locaux)
│ │ │ │ └─ 📦 Dépendances:
│ │ │ │ ├─ @/i18n/routing
│ │ │ │ └─ @/lib/db
│ │ │ ├── 📜 Footer.tsx
│ │ │ │ ├─ 📊 Imports: 5 total (0 locaux)
│ │ │ │ └─ 📦 Dépendances:
│ │ │ │ ├─ @/i18n/navigation
│ │ │ │ ├─ lucide-react
│ │ │ │ ├─ react
│ │ │ │ ├─ @/components/complaint/ComplaintModal
│ │ │ │ └─ next-intl
│ │ │ ├── 📜 Header.tsx
│ │ │ │ ├─ 📊 Imports: 6 total (1 locaux)
│ │ │ │ └─ 📦 Dépendances:
│ │ │ │ ├─ @/i18n/navigation
│ │ │ │ ├─ @/lib/db
│ │ │ │ ├─ @/components/search/MobileSearchBar
│ │ │ │ ├─ ./HeaderClientActions
│ │ │ │ ├─ @/i18n/routing
│ │ │ │ └─ next-intl/server
│ │ │ ├── 📜 HeaderClientActions.tsx
│ │ │ │ ├─ 📊 Imports: 12 total (2 locaux)
│ │ │ │ └─ 📦 Dépendances:
│ │ │ │ ├─ @/i18n/navigation
│ │ │ │ ├─ @/lib/store/useCart
│ │ │ │ ├─ @/components/auth/AuthModal
│ │ │ │ ├─ lucide-react
│ │ │ │ ├─ react
│ │ │ │ ├─ ./MobileMenu
│ │ │ │ ├─ @/lib/store/useAuth
│ │ │ │ ├─ ./LocaleSwitcher
│ │ │ │ ├─ @/components/cart/CartDrawer
│ │ │ │ └─ @/i18n/routing
│ │ │ ├── 📜 LocaleSwitcher.tsx
│ │ │ │ ├─ 📊 Imports: 5 total (0 locaux)
│ │ │ │ └─ 📦 Dépendances:
│ │ │ │ ├─ @/i18n/navigation
│ │ │ │ ├─ react
│ │ │ │ ├─ @/i18n/routing
│ │ │ │ ├─ next-intl
│ │ │ │ └─ lucide-react
│ │ │ └── 📜 MobileMenu.tsx
│ │ │ ├─ 📊 Imports: 6 total (0 locaux)
│ │ │ └─ 📦 Dépendances:
│ │ │ ├─ @/i18n/navigation
│ │ │ ├─ @/lib/db
│ │ │ ├─ lucide-react
│ │ │ ├─ react
│ │ │ ├─ @/types
│ │ │ └─ next-intl
│ │ ├── 📁 order/
│ │ │ └── 📜 OrderDetailModal.tsx
│ │ │ ├─ 📊 Imports: 7 total (0 locaux)
│ │ │ └─ 📦 Dépendances:
│ │ │ ├─ @/i18n/navigation
│ │ │ ├─ lucide-react
│ │ │ ├─ react
│ │ │ ├─ @/types
│ │ │ ├─ @/lib/store/useSettings
│ │ │ ├─ next-intl
│ │ │ └─ next/image
│ │ ├── 📁 product/
│ │ │ ├── 📜 ProductCard.tsx
│ │ │ │ ├─ 📊 Imports: 8 total (0 locaux)
│ │ │ │ └─ 📦 Dépendances:
│ │ │ │ ├─ @/i18n/navigation
│ │ │ │ ├─ sonner
│ │ │ │ ├─ lucide-react
│ │ │ │ ├─ @/types
│ │ │ │ ├─ @/lib/utils
│ │ │ │ ├─ next-intl
│ │ │ │ ├─ next/image
│ │ │ │ └─ @/lib/store/useFavorites
│ │ │ ├── 📜 ProductDescription.tsx
│ │ │ │ ├─ 📊 Imports: 3 total (0 locaux)
│ │ │ │ └─ 📦 Dépendances:
│ │ │ │ ├─ next-intl
│ │ │ │ ├─ next/image
│ │ │ │ └─ @/types
│ │ │ ├── 📜 ProductDetailTop.tsx
│ │ │ │ ├─ 📊 Imports: 4 total (2 locaux)
│ │ │ │ └─ 📦 Dépendances:
│ │ │ │ ├─ react
│ │ │ │ ├─ ./ProductGallery
│ │ │ │ ├─ ./ProductInfo
│ │ │ │ └─ @/types
│ │ │ ├── 📜 ProductGallery.tsx
│ │ │ │ ├─ 📊 Imports: 2 total (0 locaux)
│ │ │ │ └─ 📦 Dépendances:
│ │ │ │ ├─ next-intl
│ │ │ │ └─ next/image
│ │ │ ├── 📜 ProductInfo.tsx
│ │ │ │ ├─ 📊 Imports: 8 total (0 locaux)
│ │ │ │ └─ 📦 Dépendances:
│ │ │ │ ├─ @/lib/store/useCart
│ │ │ │ ├─ sonner
│ │ │ │ ├─ lucide-react
│ │ │ │ ├─ react
│ │ │ │ ├─ @/types
│ │ │ │ ├─ @/lib/utils
│ │ │ │ ├─ next-intl
│ │ │ │ └─ next/image
│ │ │ ├── 📜 ProductReviews.tsx
│ │ │ │ ├─ 📊 Imports: 7 total (0 locaux)
│ │ │ │ └─ 📦 Dépendances:
│ │ │ │ ├─ lucide-react
│ │ │ │ ├─ react
│ │ │ │ ├─ @/types
│ │ │ │ ├─ @/components/review/ReviewForm
│ │ │ │ ├─ @/lib/store/useReviews
│ │ │ │ ├─ next-intl
│ │ │ │ └─ next/image
│ │ │ ├── 📜 ProductSpecs.tsx
│ │ │ │ ├─ 📊 Imports: 2 total (0 locaux)
│ │ │ │ └─ 📦 Dépendances:
│ │ │ │ ├─ next-intl
│ │ │ │ └─ @/types
│ │ │ └── 📜 RelatedProducts.tsx
│ │ │ ├─ 📊 Imports: 2 total (0 locaux)
│ │ │ └─ 📦 Dépendances:
│ │ │ ├─ @/components/product/ProductCard
│ │ │ └─ @/types
│ │ ├── 📁 returns/
│ │ │ └── 📜 ReturnsForm.tsx
│ │ │ ├─ 📊 Imports: 9 total (0 locaux)
│ │ │ └─ 📦 Dépendances:
│ │ │ ├─ next/navigation
│ │ │ ├─ sonner
│ │ │ ├─ lucide-react
│ │ │ ├─ react
│ │ │ ├─ @/lib/store/useAuth
│ │ │ ├─ @/lib/store/useOrders
│ │ │ ├─ @/lib/utils
│ │ │ ├─ next-intl
│ │ │ └─ next/image
│ │ ├── 📁 review/
│ │ │ └── 📜 ReviewForm.tsx
│ │ │ ├─ 📊 Imports: 8 total (0 locaux)
│ │ │ └─ 📦 Dépendances:
│ │ │ ├─ sonner
│ │ │ ├─ lucide-react
│ │ │ ├─ react
│ │ │ ├─ @/lib/store/useAuth
│ │ │ ├─ @/types
│ │ │ ├─ @/lib/store/useReviews
│ │ │ ├─ next-intl
│ │ │ └─ next/image
│ │ ├── 📁 search/
│ │ │ ├── 📜 MobileSearchBar.tsx
│ │ │ │ ├─ 📊 Imports: 4 total (1 locaux)
│ │ │ │ └─ 📦 Dépendances:
│ │ │ │ ├─ next-intl
│ │ │ │ ├─ react
│ │ │ │ ├─ lucide-react
│ │ │ │ └─ ./SearchModal
│ │ │ └── 📜 SearchModal.tsx
│ │ │ ├─ 📊 Imports: 7 total (0 locaux)
│ │ │ └─ 📦 Dépendances:
│ │ │ ├─ @/i18n/navigation
│ │ │ ├─ @/lib/db
│ │ │ ├─ react
│ │ │ ├─ @/types
│ │ │ ├─ react-dom
│ │ │ ├─ next-intl
│ │ │ └─ next/image
│ │ ├── 📁 shared/
│ │ │ └── 📜 CookieConsent.tsx
│ │ │ ├─ 📊 Imports: 3 total (0 locaux)
│ │ │ └─ 📦 Dépendances:
│ │ │ ├─ next-intl
│ │ │ ├─ react
│ │ │ └─ @/components/ui/Button
│ │ ├── 📁 shop/
│ │ │ └── 📜 ShopFilters.tsx
│ │ │ ├─ 📊 Imports: 7 total (0 locaux)
│ │ │ └─ 📦 Dépendances:
│ │ │ ├─ next/navigation
│ │ │ ├─ @/lib/db
│ │ │ ├─ lucide-react
│ │ │ ├─ react
│ │ │ ├─ @/types
│ │ │ ├─ next-intl
│ │ │ └─ next/image
│ │ └── 📁 ui/
│ │ ├── 📜 Badge.tsx
│ │ │ ├─ 📊 Imports: 1 total (0 locaux)
│ │ │ └─ 📦 Dépendances:
│ │ │ └─ @/lib/utils
│ │ ├── 📜 Button.tsx
│ │ │ ├─ 📊 Imports: 2 total (0 locaux)
│ │ │ └─ 📦 Dépendances:
│ │ │ ├─ react
│ │ │ └─ @/lib/utils
│ │ ├── 📜 Input.tsx
│ │ │ ├─ 📊 Imports: 2 total (0 locaux)
│ │ │ └─ 📦 Dépendances:
│ │ │ ├─ react
│ │ │ └─ @/lib/utils
│ │ └── 📜 Skeleton.tsx
│ │ ├─ 📊 Imports: 1 total (0 locaux)
│ │ └─ 📦 Dépendances:
│ │ └─ @/lib/utils
│ ├── 📁 data/
│ │ ├── 📄 about.json
│ │ ├── 📜 brands.ts
│ │ ├── 📄 categories.json
│ │ ├── 📄 complaints.json
│ │ ├── 📄 contact-messages.json
│ │ ├── 📄 contact-topics.json
│ │ ├── 📄 contact.json
│ │ ├── 📄 orders.json
│ │ ├── 📄 products.json
│ │ ├── 📄 returns.json
│ │ ├── 📄 settings.json
│ │ └── 📄 taxes.json
│ ├── 📁 i18n/
│ │ ├── 📜 navigation.ts
│ │ │ ├─ 📊 Imports: 2 total (1 locaux)
│ │ │ └─ 📦 Dépendances:
│ │ │ ├─ next-intl/navigation
│ │ │ └─ ./routing
│ │ ├── 📜 request.ts
│ │ │ ├─ 📊 Imports: 2 total (1 locaux)
│ │ │ └─ 📦 Dépendances:
│ │ │ ├─ ./routing
│ │ │ └─ next-intl/server
│ │ └── 📜 routing.ts
│ │ ├─ 📊 Imports: 1 total (0 locaux)
│ │ └─ 📦 Dépendances:
│ │ └─ next-intl/routing
│ ├── 📁 lib/
│ │ ├── 📜 db.ts
│ │ │ ├─ 📊 Imports: 7 total (0 locaux)
│ │ │ └─ 📦 Dépendances:
│ │ │ ├─ @/data/categories.json
│ │ │ ├─ @/data/settings.json
│ │ │ ├─ @/data/returns.json
│ │ │ ├─ @/data/contact-topics.json
│ │ │ ├─ @/data/contact.json
│ │ │ ├─ @/data/products.json
│ │ │ └─ @/data/about.json
│ │ ├── 📁 store/
│ │ │ ├── 📜 useAddresses.ts
│ │ │ │ ├─ 📊 Imports: 2 total (0 locaux)
│ │ │ │ └─ 📦 Dépendances:
│ │ │ │ ├─ zustand/middleware
│ │ │ │ └─ zustand
│ │ │ ├── 📜 useAuth.ts
│ │ │ │ ├─ 📊 Imports: 3 total (0 locaux)
│ │ │ │ └─ 📦 Dépendances:
│ │ │ │ ├─ @/types
│ │ │ │ ├─ zustand/middleware
│ │ │ │ └─ zustand
│ │ │ ├── 📜 useCart.ts
│ │ │ │ ├─ 📊 Imports: 3 total (0 locaux)
│ │ │ │ └─ 📦 Dépendances:
│ │ │ │ ├─ @/types
│ │ │ │ ├─ zustand/middleware
│ │ │ │ └─ zustand
│ │ │ ├── 📜 useFavorites.ts
│ │ │ │ ├─ 📊 Imports: 2 total (0 locaux)
│ │ │ │ └─ 📦 Dépendances:
│ │ │ │ ├─ zustand/middleware
│ │ │ │ └─ zustand
│ │ │ ├── 📜 useOrders.ts
│ │ │ │ ├─ 📊 Imports: 3 total (0 locaux)
│ │ │ │ └─ 📦 Dépendances:
│ │ │ │ ├─ @/types
│ │ │ │ ├─ zustand/middleware
│ │ │ │ └─ zustand
│ │ │ ├── 📜 useReviews.ts
│ │ │ │ ├─ 📊 Imports: 3 total (0 locaux)
│ │ │ │ └─ 📦 Dépendances:
│ │ │ │ ├─ @/types
│ │ │ │ ├─ zustand/middleware
│ │ │ │ └─ zustand
│ │ │ └── 📜 useSettings.ts
│ │ │ ├─ 📊 Imports: 2 total (0 locaux)
│ │ │ └─ 📦 Dépendances:
│ │ │ ├─ @/data/settings.json
│ │ │ └─ zustand
│ │ └── 📜 utils.ts
│ │ ├─ 📊 Imports: 2 total (0 locaux)
│ │ └─ 📦 Dépendances:
│ │ ├─ tailwind-merge
│ │ └─ clsx
│ ├── 📜 middleware.ts
│ │ ├─ 📊 Imports: 2 total (1 locaux)
│ │ └─ 📦 Dépendances:
│ │ ├─ ./i18n/routing
│ │ └─ next-intl/middleware
│ └── 📁 types/
│ └── 📜 index.ts
├── 📜 tailwind.config.ts
│ ├─ 📊 Imports: 1 total (0 locaux)
│ └─ 📦 Dépendances:
│ └─ tailwindcss
└── 📄 tsconfig.json

====================================================================================================
✅ Analyse terminée - 663 éléments affichés
