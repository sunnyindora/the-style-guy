import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const minRating = searchParams.get("rating");
    const minDiscount = searchParams.get("minDiscount");
    const store = searchParams.get("store");
    const color = searchParams.get("color");
    const size = searchParams.get("size");
    const sort = searchParams.get("sort") || "relevance";
    const featured = searchParams.get("featured");
    const trending = searchParams.get("trending");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const perPage = Math.min(48, parseInt(searchParams.get("perPage") || "24"));

    const where: Prisma.ProductWhereInput = {
      availability: true,
    };

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
    if (color) where.colors = { has: color };
    if (size) where.sizes = { has: size };
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) (where.price as Prisma.FloatFilter).gte = parseFloat(minPrice);
      if (maxPrice) (where.price as Prisma.FloatFilter).lte = parseFloat(maxPrice);
    }
    if (minRating) where.rating = { gte: parseFloat(minRating) };
    if (minDiscount) where.discount = { gte: parseInt(minDiscount) };
    if (featured === "true") where.featured = true;
    if (trending === "true") where.trending = true;

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
    switch (sort) {
      case "price_asc":
        orderBy = { price: "asc" };
        break;
      case "price_desc":
        orderBy = { price: "desc" };
        break;
      case "rating":
        orderBy = { rating: "desc" };
        break;
      case "discount":
        orderBy = { discount: "desc" };
        break;
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      default:
        orderBy = featured === "true" || trending === "true"
          ? { rating: "desc" }
          : { createdAt: "desc" };
    }

    const [products, total, brands, cats, stores, aggregations] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * perPage,
        take: perPage,
        include: { category: true },
      }),
      prisma.product.count({ where }),
      prisma.product.groupBy({ by: ["brand"], _count: { brand: true }, orderBy: { _count: { brand: "desc" } }, take: 20 }),
      prisma.category.findMany({ include: { _count: { select: { products: true } } } }),
      prisma.product.groupBy({ by: ["store"], _count: { store: true }, orderBy: { _count: { store: "desc" } } }),
      prisma.product.aggregate({
        where,
        _min: { price: true },
        _max: { price: true },
      }),
    ]);

    // Aggregate colors & sizes across products (simplified)
    const colorCounts: Record<string, number> = {};
    const sizeCounts: Record<string, number> = {};
    const facetProducts = await prisma.product.findMany({
      where,
      select: { colors: true, sizes: true },
      take: 200,
    });
    for (const fp of facetProducts) {
      for (const c of fp.colors) colorCounts[c] = (colorCounts[c] || 0) + 1;
      for (const s of fp.sizes) sizeCounts[s] = (sizeCounts[s] || 0) + 1;
    }

    const cacheHeaders = { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" };

    return NextResponse.json(
      {
        products,
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
        facets: {
          brands: brands.map((b) => ({ name: b.brand, count: b._count.brand })),
          categories: cats.map((c) => ({ name: c.name, slug: c.slug, count: c._count.products })),
          stores: stores.map((s) => ({ name: s.store, count: s._count.store })),
          priceRange: { min: aggregations._min.price || 0, max: aggregations._max.price || 0 },
          colors: Object.entries(colorCounts).map(([name, count]) => ({ name, count })).slice(0, 15),
          sizes: Object.entries(sizeCounts).map(([name, count]) => ({ name, count })).slice(0, 15),
        },
      },
      { headers: cacheHeaders }
    );
  } catch (error) {
    console.error("Products API error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
