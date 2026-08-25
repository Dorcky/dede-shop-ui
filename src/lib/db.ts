import {
  Product,
  Category,
  Settings,
  AboutContent,
  ContactContent,
  ReturnsContent,
  ContactTopic
} from "@/types";

// Simulation d'un délai réseau (utile pour tester les loaders/skeletons)
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getProducts(): Promise<Product[]> {
  await delay(300);
  const data = await import("@/data/products.json");
  // ✅ On caste le tableau entier en Product[] AVANT de filtrer
  return (data.default as Product[]).filter((p) => p.isActive);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  await delay(200);
  const data = await import("@/data/products.json");
  // ✅ On caste le tableau entier en Product[] AVANT de chercher
  return (data.default as Product[]).find((p) => p.slug === slug) || null;
}

export async function getCategories(): Promise<Category[]> {
  await delay(200);
  const data = await import("@/data/categories.json");
  // ✅ On caste le tableau entier en Category[]
  return (data.default as Category[])
    .filter((c) => c.isActive)
    .sort((a, b) => a.order - b.order);
}

export async function getSettings(): Promise<Settings> {
  const data = await import("@/data/settings.json");
  return data.default as Settings;
}

export async function getAboutContent(): Promise<AboutContent> {
  const data = await import("@/data/about.json");
  return data.default as AboutContent;
}

export async function getContactContent(): Promise<ContactContent> {
  const data = await import("@/data/contact.json");
  return data.default as ContactContent;
}

export async function getReturnsContent(): Promise<ReturnsContent> {
  const data = await import("@/data/returns.json");
  return data.default as ReturnsContent;
}

export async function getContactTopics(): Promise<ContactTopic[]> {
  const data = await import("@/data/contact-topics.json");
  return (data.default as ContactTopic[]).sort((a, b) => a.order - b.order);
}
