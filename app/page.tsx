import Link from "next/link";
import Image from "next/image";
import { ArrowRight, TrendingUp, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/products/ProductCard";
import { CategoryCard } from "@/components/products/CategoryCard";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { Button } from "@/components/ui/button";
import { constructMetadata } from "@/lib/seo/metadata";

export const metadata = constructMetadata({
  title: "Men's Fashion, Style Guides & Best Deals",
  description:
    "THE STYLE GUY — Dress Better. Look Sharper. Discover men's fashion, compare prices across stores, find the best deals on shirts, jeans, sneakers, watches & more.",
});

// Revalidate this page every 5 minutes
export const revalidate = 300;

async function getHomeData() {
  try {
    const [trending, featured, categories, articles] = await Promise.all([
      prisma.product.findMany({
        where: { trending: true, availability: true },
        orderBy: { rating: "desc" },
        take: 8,
        include: { category: true },
      }),
      prisma.product.findMany({
        where: { featured: true, availability: true },
        orderBy: { rating: "desc" },
        take: 4,
        include: { category: true },
      }),
      prisma.category.findMany({ take: 12, include: { _count: { select: { products: true } } } }),
      prisma.article.findMany({
        where: { published: true },
        orderBy: { publishedAt: "desc" },
        take: 5,
        include: { category: true },
      }),
    ]);

    if (trending.length < 8) {
      const extra = await prisma.product.findMany({
        where: { availability: true, id: { notIn: trending.map((p) => p.id) } },
        orderBy: { rating: "desc" },
        take: 8 - trending.length,
        include: { category: true },
      });
      trending.push(...extra);
    }

    return { trending, featured, categories, articles };
  } catch (e) {
    return { trending: [] as any[], featured: [] as any[], categories: [] as any[], articles: [] as any[] };
  }
}

export default async function HomePage() {
  const { trending, categories, articles } = await getHomeData();
  const featuredArticle = articles[0];
  const otherArticles = articles.slice(1, 5);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden bg-neutral-950 text-white">
        <Image
          src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1920&q=80"
          alt="Premium Men's Fashion"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="relative z-10 h-full max-w-[1600px] mx-auto px-6 md:px-12 flex items-center">
          <div className="max-w-2xl animate-fade-in-up">
            <p className="text-[11px] md:text-sm tracking-[0.4em] uppercase text-amber-400 mb-6">
              Fall / Winter Collection 2025
            </p>
            <h1 className="font-serif-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-6">
              Dress Better.<br />Look Sharper.
            </h1>
            <p className="text-base md:text-lg text-white/80 mb-10 max-w-lg leading-relaxed">
              Discover men's fashion, compare products across stores, and build your perfect look. Your style. Your rules.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button as="link" href="/shop" size="lg" variant="dark">
                Shop The Look <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                as="link"
                href="/style-guides"
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-neutral-900"
              >
                Explore Style Guides
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-xs tracking-[0.3em] uppercase animate-pulse">
          Scroll
        </div>
      </section>

      {/* Value props strip */}
      <section className="border-b border-neutral-200">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: "Best Prices", sub: "Across stores" },
            { label: "Curated Picks", sub: "Style experts" },
            { label: "Free Returns", sub: "Partner stores" },
            { label: "Daily Deals", sub: "Handpicked offers" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center">
              <p className="text-sm md:text-base font-bold uppercase tracking-widest">{item.label}</p>
              <p className="text-xs text-neutral-500 mt-1">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Now */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5" />
              <p className="text-[11px] tracking-[0.3em] uppercase text-neutral-500">Fresh Picks</p>
            </div>
            <h2 className="font-serif-display text-4xl md:text-5xl font-bold editorial-line">Trending Now</h2>
          </div>
          <Link
            href="/shop?trending=true"
            className="hidden md:flex items-center gap-2 text-sm font-semibold uppercase tracking-widest hover:gap-4 transition-all"
          >
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {trending.map((product, i) => (
            <ProductCard key={product.id} product={product} priority={i < 4} />
          ))}
        </div>
        <div className="mt-10 text-center md:hidden">
          <Button as="link" href="/shop?trending=true" variant="outline">
            View All Trending
          </Button>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="bg-neutral-50 py-16 md:py-24">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <p className="text-[11px] tracking-[0.3em] uppercase text-neutral-500 mb-3">Browse</p>
            <h2 className="font-serif-display text-4xl md:text-5xl font-bold editorial-line">Shop by Category</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Feature */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="text-center mb-12">
          <p className="text-[11px] tracking-[0.3em] uppercase text-neutral-500 mb-3">The Magazine</p>
          <h2 className="font-serif-display text-4xl md:text-5xl font-bold editorial-line">The Style Edit</h2>
        </div>

        {featuredArticle && (
          <div className="mb-12">
            <ArticleCard article={featuredArticle} variant="featured" />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {otherArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button as="link" href="/style-guides" variant="outline">
            All Style Guides
          </Button>
        </div>
      </section>

      {/* Outfit Builder CTA */}
      <section className="relative py-24 md:py-32 bg-neutral-900 text-white overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=1920&q=80"
          alt="Build Your Look"
          fill
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="relative z-10 max-w-3xl mx-auto text-center px-6">
          <p className="text-[11px] tracking-[0.4em] uppercase text-amber-400 mb-4">Interactive</p>
          <h2 className="font-serif-display text-4xl md:text-6xl font-bold mb-6">Build Your Look</h2>
          <p className="text-white/80 text-lg mb-8 leading-relaxed">
            Not sure what to wear? Pick your occasion and we'll put together the perfect outfit — from shirt to shoes, with every product shoppable.
          </p>
          <Button as="link" href="/outfit-builder" size="lg" variant="dark">
            Start Building <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Affiliate disclosure bar */}
      <section className="bg-neutral-100 border-b border-neutral-200">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-4 text-center text-xs text-neutral-600">
          <strong>Affiliate Disclosure:</strong> The Style Guy participates in affiliate programs. We may earn a commission when you purchase through links on our website, at no additional cost to you.{" "}
          <Link href="/affiliate-disclosure" className="underline hover:text-neutral-900">Learn more</Link>
        </div>
      </section>
    </div>
  );
}
