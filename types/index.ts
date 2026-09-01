import type { Product, Category, Article, Outfit, AffiliateSource } from "@prisma/client";

export type ProductWithCategory = Product & { category: Category | null };

export interface SearchFilters {
  q?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  minDiscount?: number;
  store?: string;
  color?: string;
  size?: string;
  sort?: "relevance" | "price_asc" | "price_desc" | "rating" | "discount" | "newest";
  page?: number;
  perPage?: number;
}

export interface SearchResults {
  products: ProductWithCategory[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  facets: {
    brands: { name: string; count: number }[];
    categories: { name: string; slug: string; count: number }[];
    stores: { name: string; count: number }[];
    priceRange: { min: number; max: number };
    colors: { name: string; count: number }[];
    sizes: { name: string; count: number }[];
  };
}

export type Occasion = "casual" | "office" | "date" | "wedding" | "party" | "travel" | "smart-casual";

export interface OutfitSelection {
  occasion: Occasion;
  shirt?: string;
  trousers?: string;
  shoes?: string;
  watch?: string;
  accessories?: string[];
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}
