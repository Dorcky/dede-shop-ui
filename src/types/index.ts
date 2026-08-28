export type Locale = "fr" | "en";

export interface Translatable {
  fr: string;
  en: string;
}

export interface Category {
  id: string;
  slug: string;
  image: string;
  name: Translatable;
  description: Translatable;
  isActive: boolean;
  order: number;
}

export interface Spec {
  label: Translatable;
  value: string;
}

export interface DescriptionBlock {
  type: "paragraph" | "image";
  content?: Translatable;
  url?: string;
}

export interface Variant {
  id: string;
  name: Translatable;
  value: string;
  images: { id: string; url: string; order: number }[];
}

export interface Product {
  id: string;
  slug: string;
  categoryId: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  isFeatured: boolean;
  isDigital: boolean;
  stock: number;
  warranty: number;
  brand: string;
  name: Translatable;
  description: Translatable;
  badge?: Translatable;
  specs: Spec[];
  descriptionBlocks: DescriptionBlock[];
  variants: Variant[];
}

export interface Settings {
  brandName: string;
  currency: string;
  currencySymbol: string;
  shipping: {
    freeThreshold: number;
    localCost: number;
    internationalCost: number;
    bannerText: Translatable;
  };
}

export interface CartItem {
  productId: string;
  productSlug: string;
  variantId: string;
  name: string;
  variantName: string;
  price: number;
  image: string;
  quantity: number;
  isDigital: boolean;
}

export interface ShippingInfo {
  freeThreshold: number;
  localCost: number;
  internationalCost: number;
}

export type OrderStatus =
  | "CONFIRMED"
  | "PREPARING"
  | "SHIPPED"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderItem {
  productId: string;
  productSlug: string;
  productName: { fr: string; en: string };
  variantName: string;
  quantity: number;
  price: number;
  isDigital: boolean;
  image: string;
}

export interface TrackingStep {
  label: { fr: string; en: string };
  done: boolean;
  date: string;
  status: OrderStatus;
  location: string | null;
  eta: string | null;
}

export interface Order {
  id: string;
  userId: string | null;
  status: OrderStatus;
  total: number;
  shippingCost: number;
  discountAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  items: OrderItem[];
  tracking: TrackingStep[];
  createdAt: string;
  updatedAt: string;
}

export type AuthMode = "login" | "register" | "verify" | "forgot" | "reset";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "CUSTOMER" | "ADMIN";
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  topicId: string;
  message: string;
  userId: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface Complaint {
  id: string;
  type: "RETURN" | "COMPLAINT";
  orderId: string | null;
  userId: string | null;
  name: string;
  email: string;
  subject: string;
  reason: string | null;
  message: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  createdAt: string;
}

export interface ContactTopic {
  id: string;
  order: number;
  name: { fr: string; en: string };
}

export interface AboutContent {
  heroImage: string;
  subtitle: { fr: string; en: string };
  title: { fr: string; en: string };
  description1: { fr: string; en: string };
  description2: { fr: string; en: string };
  value1Title: { fr: string; en: string };
  value1Desc: { fr: string; en: string };
  value2Title: { fr: string; en: string };
  value2Desc: { fr: string; en: string };
  value3Title: { fr: string; en: string };
  value3Desc: { fr: string; en: string };
}

export interface ContactContent {
  subtitle: { fr: string; en: string };
  title: { fr: string; en: string };
  description: { fr: string; en: string };
  email: string;
  phone: string;
  openingHours: { fr: string; en: string };
}

export interface ReturnsContent {
  subtitle: { fr: string; en: string };
  title: { fr: string; en: string };
  description: { fr: string; en: string };
  step1Title: { fr: string; en: string };
  step1Desc: { fr: string; en: string };
  step2Title: { fr: string; en: string };
  step2Desc: { fr: string; en: string };
  step3Title: { fr: string; en: string };
  step3Desc: { fr: string; en: string };
}

export interface Review {
  id: string;
  productId: string;
  userId: string | null;
  name: string;
  rating: number;
  text: string;
  images: string[]; // URLs d'images (base64 ou URLs)
  date: string;
  isApproved: boolean;
}

export interface TaxLine {
  ruleId: string;
  type: string;
  rate: number;
  amount: number;
  priority: number;
}

export interface TaxCalculation {
  subtotal: number;
  shipping: number;
  taxes: TaxLine[];
  taxTotal: number;
  grandTotal: number;
  auditRecord: {
    calculationId: string;
    timestamp: string;
    destination: string;
    matchedRules: string[];
  };
}
