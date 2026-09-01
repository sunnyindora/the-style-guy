"use client";
import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";

interface Facets {
  brands: { name: string; count: number }[];
  categories: { name: string; slug: string; count: number }[];
  stores: { name: string; count: number }[];
  priceRange: { min: number; max: number };
  colors: { name: string; count: number }[];
  sizes: { name: string; count: number }[];
}

export function ShopFilters({ facets, currentCategory }: { facets: Facets; currentCategory?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    category: true, brand: true, price: false, rating: false, store: false, discount: false,
  });

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    if (value === null || value === "") params.delete(key);
    else params.set(key, value);
    router.push(`${pathname}?${params.toString()}`);
  };

  const currentSort = searchParams.get("sort") || "newest";
  const currentBrand = searchParams.get("brand") || "";
  const currentStore = searchParams.get("store") || "";
  const currentRating = searchParams.get("rating") || "";
  const currentMinDisc = searchParams.get("minDiscount") || "";

  const toggle = (section: string) =>
    setExpanded((p) => ({ ...p, [section]: !p[section] }));

  const clearAll = () => router.push(pathname);

  const sidebar = (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-neutral-200">
        <h3 className="text-sm font-bold uppercase tracking-widest">Filters</h3>
        <button onClick={clearAll} className="text-xs text-neutral-500 hover:text-neutral-900 underline">
          Clear all
        </button>
      </div>

      <FilterSection title="Category" open={expanded.category} onToggle={() => toggle("category")}>
        <div className="space-y-2 pt-2">
          <FilterLink active={!currentCategory} href="/shop">All Products</FilterLink>
          {facets.categories.map((c) => (
            <FilterLink key={c.slug} active={currentCategory === c.slug} href={`/shop?category=${c.slug}`}>
              {c.name} <span className="text-neutral-400">({c.count})</span>
            </FilterLink>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Sort By" open={true} onToggle={() => {}}>
        <select
          value={currentSort}
          onChange={(e) => updateParam("sort", e.target.value)}
          className="w-full border border-neutral-300 p-2 text-sm mt-2 bg-white"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
          <option value="rating">Highest Rated</option>
          <option value="discount">Biggest Discount</option>
          <option value="relevance">Relevance</option>
        </select>
      </FilterSection>

      <FilterSection title="Brand" open={expanded.brand} onToggle={() => toggle("brand")}>
        <div className="space-y-2 pt-2 max-h-48 overflow-y-auto">
          {facets.brands.slice(0, 12).map((b) => (
            <label key={b.name} className="flex items-center gap-2 text-sm cursor-pointer hover:text-neutral-900">
              <input
                type="radio"
                name="brand"
                checked={currentBrand === b.name}
                onChange={() => updateParam("brand", currentBrand === b.name ? null : b.name)}
                className="accent-neutral-900"
              />
              <span className={cn(currentBrand === b.name ? "font-medium" : "text-neutral-700")}>
                {b.name}
              </span>
              <span className="text-neutral-400 text-xs">({b.count})</span>
            </label>
          ))}
          {currentBrand && !facets.brands.some((b) => b.name === currentBrand) && (
            <p className="text-xs text-neutral-500 italic">Filter: {currentBrand}</p>
          )}
        </div>
      </FilterSection>

      <FilterSection title="Price Range" open={expanded.price} onToggle={() => toggle("price")}>
        <div className="pt-2 space-y-2">
          <p className="text-xs text-neutral-500">
            {formatPrice(facets.priceRange.min)} — {formatPrice(facets.priceRange.max)}
          </p>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              defaultValue={searchParams.get("minPrice") || ""}
              onKeyDown={(e) => {
                if (e.key === "Enter") updateParam("minPrice", (e.target as HTMLInputElement).value || null);
              }}
              className="w-full border-b border-neutral-300 p-2 text-sm"
            />
            <input
              type="number"
              placeholder="Max"
              defaultValue={searchParams.get("maxPrice") || ""}
              onKeyDown={(e) => {
                if (e.key === "Enter") updateParam("maxPrice", (e.target as HTMLInputElement).value || null);
              }}
              className="w-full border-b border-neutral-300 p-2 text-sm"
            />
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Rating" open={expanded.rating} onToggle={() => toggle("rating")}>
        <div className="space-y-2 pt-2">
          {[4, 3].map((r) => (
            <label key={r} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={currentRating === String(r)}
                onChange={() => updateParam("rating", currentRating === String(r) ? null : String(r))}
                className="accent-neutral-900"
              />
              <span>{r}★ & above</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Store" open={expanded.store} onToggle={() => toggle("store")}>
        <div className="space-y-2 pt-2">
          {facets.stores.slice(0, 8).map((s) => (
            <label key={s.name} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="store"
                checked={currentStore === s.name}
                onChange={() => updateParam("store", currentStore === s.name ? null : s.name)}
                className="accent-neutral-900"
              />
              <span>{s.name}</span>
              <span className="text-neutral-400 text-xs">({s.count})</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Discount" open={expanded.discount} onToggle={() => toggle("discount")}>
        <div className="space-y-2 pt-2">
          {[30, 50, 70].map((d) => (
            <label key={d} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="discount"
                checked={currentMinDisc === String(d)}
                onChange={() => updateParam("minDiscount", currentMinDisc === String(d) ? null : String(d))}
                className="accent-neutral-900"
              />
              <span>{d}% or more</span>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden flex items-center gap-2 px-4 py-2 border border-neutral-300 text-sm font-medium uppercase tracking-wider mb-6"
      >
        <SlidersHorizontal className="w-4 h-4" /> Filters
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-24 self-start">
        {sidebar}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Filters</h3>
              <button onClick={() => setMobileOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            {sidebar}
            <button
              onClick={() => setMobileOpen(false)}
              className="w-full bg-neutral-900 text-white py-3 mt-6 uppercase tracking-widest text-sm font-medium"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function FilterSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-neutral-200 py-3">
      <button onClick={onToggle} className="flex w-full items-center justify-between text-sm font-semibold uppercase tracking-widest">
        {title}
        <ChevronDown className={cn("w-4 h-4 transition-transform", open ? "rotate-180" : "")} />
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}

function FilterLink({ href, children, active }: { href: string; children: React.ReactNode; active?: boolean }) {
  return (
    <a
      href={href}
      className={cn(
        "block text-sm py-1 transition-colors",
        active ? "text-neutral-900 font-semibold" : "text-neutral-600 hover:text-neutral-900"
      )}
    >
      {children}
    </a>
  );
}
