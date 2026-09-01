import { Suspense } from "react";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/products/ProductCard";
import { ShopFilters } from "./ShopFilters";
import { constructMetadata } from "@/lib/seo/metadata";
import { safeQuery } from "@/lib/safe-query";

export const metadata = constructMetadata({
  title: "Shop Men's Fashion",
  description: "Shop men's shirts, t-shirts, jeans, trousers, jackets, sneakers, watches, accessories and grooming products. Compare prices across stores.",
});

export const revalidate = 60;

const EMPTY = {
  products: [] as any[],
  total: 0,
  page: 1,
  perPage: 24,
  totalPages: 0,
  facets: {
    brands: [], categories: [], stores: [],
    priceRange: { min: 0, max: 0 }, colors: [], sizes: [],
  },
  q: "", sort: "newest", category: "",
};

async function getProducts(searchParams: Record<string, string | string[] | undefined>) {
  return safeQuery(async () => {
    const q = (searchParams.q as string) || "";
    const category = searchParams.category as string;
    const brand = searchParams.brand as string;
    const minPrice = searchParams.minPrice as string;
    const maxPrice = searchParams.maxPrice as string;
    const rating = searchParams.rating as string;
    const minDiscount = searchParams.minDiscount as string;
    const store = searchParams.store as string;
    const sort = (searchParams.sort as string) || "newest";
    const page = parseInt((searchParams.page as string) || "1");
    const perPage = 24;
    const trending = searchParams.trending as string;

    const where: any = { availability: true };
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { brand: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }
    if (category) where.category = { slug: category };
    if (brand) where.brand = { contains: brand, mode: "insensitive" };
    if (store) where.store = { contains: store, mode: "insensitive" };
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }
    if (rating) where.rating = { gte: parseFloat(rating) };
    if (minDiscount) where.discount = { gte: parseInt(minDiscount) };
    if (trending === "true") where.trending = true;

    let orderBy: any = { createdAt: "desc" };
    switch (sort) {
      case "price_asc": orderBy = { price: "asc" }; break;
      case "price_desc": orderBy = { price: "desc" }; break;
      case "rating": orderBy = { rating: "desc" }; break;
      case "discount": orderBy = { discount: "desc" }; break;
      case "newest": orderBy = { createdAt: "desc" }; break;
    }

    const [products, total, brands, cats, stores, agg] = await Promise.all([
      prisma.product.findMany({ where, orderBy, skip: (page - 1) * perPage, take: perPage, include: { category: true } }),
      prisma.product.count({ where }),
      prisma.product.groupBy({ by: ["brand"], _count: { brand: true }, orderBy: { _count: { brand: "desc" } }, take: 20 }),
      prisma.category.findMany({ include: { _count: { select: { products: true } } } }),
      prisma.product.groupBy({ by: ["store"], _count: { store: true }, orderBy: { _count: { store: "desc" } } }),
      prisma.product.aggregate({ where, _min: { price: true }, _max: { price: true } }),
    ]);

    const colorCounts: Record<string, number> = {};
    const sizeCounts: Record<string, number> = {};
    const fp = await prisma.product.findMany({ where, select: { colors: true, sizes: true }, take: 200 });
    for (const p of fp) {
      for (const c of p.colors) colorCounts[c] = (colorCounts[c] || 0) + 1;
      for (const s of p.sizes) sizeCounts[s] = (sizeCounts[s] || 0) + 1;
    }

    return {
      products, total, page, perPage,
      totalPages: Math.ceil(total / perPage),
      facets: {
        brands: brands.map((b: any) => ({ name: b.brand, count: b._count.brand })),
        categories: cats.map((c: any) => ({ name: c.name, slug: c.slug, count: c._count.products })),
        stores: stores.map((s: any) => ({ name: s.store, count: s._count.store })),
        priceRange: { min: agg._min.price || 0, max: agg._max.price || 0 },
        colors: Object.entries(colorCounts).map(([name, count]) => ({ name, count })).slice(0, 15),
        sizes: Object.entries(sizeCounts).map(([name, count]) => ({ name, count })).slice(0, 15),
      },
      q, sort, category,
    };
  }, EMPTY);
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const data = await getProducts(sp);

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8 md:py-12">
      <div className="mb-8">
        <p className="text-[11px] tracking-[0.3em] uppercase text-neutral-500 mb-2">Shop</p>
        <h1 className="font-serif-display text-4xl md:text-5xl font-bold">
          {data.q ? `Results for "${data.q}"` : data.category ? data.facets.categories.find(c => c.slug === data.category)?.name || "Shop" : "All Products"}
        </h1>
        <p className="text-neutral-500 mt-2">{data.total} products</p>
        {data.total === 0 && (
          <p className="text-sm text-neutral-400 mt-1">
            {process.env.NODE_ENV === "production" ? "" : "Demo data will load after database is seeded. Run `npm run db:seed`."}
          </p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <Suspense fallback={<div className="w-full lg:w-64 flex-shrink-0">Loading filters...</div>}>
          <ShopFilters facets={data.facets} currentCategory={data.category} />
        </Suspense>

        <div className="flex-1">
          {data.products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-neutral-500">No products found matching your criteria.</p>
              <p className="text-sm text-neutral-400 mt-2">Make sure your database is set up and seeded.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-8 md:gap-y-10">
              {data.products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {data.totalPages > 1 && (
            <PaginationBar currentPage={data.page} totalPages={data.totalPages} />
          )}
        </div>
      </div>
    </div>
  );
}

function PaginationBar({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  const end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex justify-center items-center gap-2 mt-12">
      {pages.map((p) => (
        <a
          key={p}
          href={`?page=${p}`}
          className={`w-10 h-10 flex items-center justify-center text-sm border transition-colors ${
            p === currentPage
              ? "bg-neutral-900 text-white border-neutral-900"
              : "border-neutral-300 hover:border-neutral-900"
          }`}
        >
          {p}
        </a>
      ))}
    </div>
  );
}
