import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, Heart, CheckCircle, XCircle, ArrowRight, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { safeQuery } from "@/lib/safe-query";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/products/ProductCard";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { formatPrice, cn } from "@/lib/utils";
import { constructMetadata, productSchema, breadcrumbSchema } from "@/lib/seo/metadata";

export const revalidate = 300;

async function getProduct(slug: string) {
  return safeQuery(async () => {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    });
    if (!product) return null;

    const [similar, relatedArticles] = await Promise.all([
      prisma.product.findMany({
        where: { categoryId: product.categoryId, id: { not: product.id }, availability: true },
        orderBy: { rating: "desc" },
        take: 8,
        include: { category: true },
      }),
      prisma.article.findMany({
        where: { published: true, categoryId: product.categoryId },
        orderBy: { publishedAt: "desc" },
        take: 3,
        include: { category: true },
      }),
    ]);

    return { product, similar, relatedArticles };
  }, null as any);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getProduct(slug);
  if (!data) return constructMetadata({ title: "Product Not Found", noIndex: true });

  const { product } = data;
  return constructMetadata({
    title: `${product.name} | ${product.brand}`,
    description: `${product.brand} ${product.name} — Buy at best price. ${formatPrice(product.price)} (was ${formatPrice(product.originalPrice)}, ${product.discount}% off). ${product.description.slice(0, 120)}...`,
    image: product.image,
    canonical: `/product/${product.slug}`,
  });
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getProduct(slug);
  if (!data) notFound();
  const anyData: any = data;
  const product: any = anyData.product;
  const similar: any[] = anyData.similar;
  const relatedArticles: any[] = anyData.relatedArticles;

  const discountPct = product.discount;
  const stars = { full: Math.floor(product.rating), half: product.rating % 1 >= 0.5 ? 1 : 0 };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="border-b border-neutral-200">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-4">
          <nav className="flex items-center gap-2 text-xs text-neutral-500">
            <Link href="/" className="hover:text-neutral-900">Home</Link>
            <ChevronRight className="w-3 h-3" />
            {product.category && (
              <>
                <Link href={`/category/${product.category.slug}`} className="hover:text-neutral-900">
                  {product.category.name}
                </Link>
                <ChevronRight className="w-3 h-3" />
              </>
            )}
            <span className="text-neutral-900">{product.name}</span>
          </nav>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(
                breadcrumbSchema([
                  { name: "Home", url: "/" },
                  ...(product.category ? [{ name: product.category.name, url: `/category/${product.category.slug}` }] : []),
                  { name: product.name, url: `/product/${product.slug}` },
                ])
              ),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema({
              name: product.name, brand: product.brand, description: product.description,
              image: product.image, price: product.price, originalPrice: product.originalPrice,
              rating: product.rating, reviewCount: product.reviewCount, slug: product.slug,
              store: product.store, availability: product.availability,
            })) }}
          />
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {discountPct > 0 && <Badge variant="sale">-{discountPct}%</Badge>}
                {product.trending && <Badge variant="pick">TRENDING</Badge>}
              </div>
              <button className="absolute top-4 right-4 p-3 bg-white/90 hover:bg-white transition-colors" aria-label="Wishlist">
                <Heart className="w-5 h-5" />
              </button>
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(0, 4).map((img: any, i: number) => (
                  <div key={i} className="relative aspect-square bg-neutral-100 overflow-hidden cursor-pointer border border-neutral-200 hover:border-neutral-900 transition-colors">
                    <Image src={img} alt={`${product.name} ${i + 1}`} fill sizes="100px" className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-500 mb-2">{product.brand}</p>
            <h1 className="font-serif-display text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-4 h-4",
                      i < stars.full ? "fill-amber-500 text-amber-500" : "text-neutral-300"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-neutral-600">
                {product.rating.toFixed(1)} ({product.reviewCount} reviews)
              </span>
            </div>

            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-lg text-neutral-400 line-through">{formatPrice(product.originalPrice)}</span>
                  <span className="text-red-600 font-semibold text-sm">{discountPct}% OFF</span>
                </>
              )}
            </div>
            <p className="text-xs text-neutral-500 mb-6">Inclusive of all taxes</p>

            <div className="border-t border-b border-neutral-200 py-5 mb-6">
              <p className="text-xs uppercase tracking-widest text-neutral-500 mb-2">Available at</p>
              <div className="flex items-center gap-3">
                <div className="px-3 py-2 bg-neutral-900 text-white text-sm font-semibold">{product.store}</div>
                <span className="text-sm text-neutral-600">Best price available</span>
              </div>
            </div>

            <div className="mb-8">
              <Button as="link" href={`/go/${product.id}`} size="lg" className="w-full md:w-auto">
                Check Best Price <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <p className="text-xs text-neutral-500 mt-3">
                You'll be redirected to the partner store to complete your purchase. Prices and availability are subject to change.
              </p>
            </div>

            {product.sizes.length > 0 && (
              <div className="mb-6">
                <p className="text-xs uppercase tracking-widest text-neutral-500 mb-3">Sizes</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size: any) => (
                    <button
                      key={size}
                      className="min-w-[48px] px-4 py-2 border border-neutral-300 text-sm hover:border-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors.length > 0 && (
              <div className="mb-6">
                <p className="text-xs uppercase tracking-widest text-neutral-500 mb-3">Colors</p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color: any) => (
                    <span key={color} className="px-3 py-1 border border-neutral-300 text-xs">{color}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-3">Description</h3>
              <p className="text-neutral-700 leading-relaxed">{product.description}</p>
            </div>

            {product.material && (
              <div className="mb-6">
                <h3 className="text-sm font-bold uppercase tracking-widest mb-2">Material</h3>
                <p className="text-neutral-700">{product.material}</p>
              </div>
            )}

            {(product.pros.length > 0 || product.cons.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-neutral-200">
                {product.pros.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-3 text-emerald-700">Pros</h3>
                    <ul className="space-y-2">
                      {product.pros.map((pro: any, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
                          <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {product.cons.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-3 text-red-700">Cons</h3>
                    <ul className="space-y-2">
                      {product.cons.map((con: any, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
                          <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {product.styleRecommendation && (
              <div className="mb-6 p-6 bg-neutral-50 border-l-4 border-neutral-900">
                <h3 className="text-sm font-bold uppercase tracking-widest mb-2">Style Tip</h3>
                <p className="text-neutral-700 text-sm leading-relaxed italic">{product.styleRecommendation}</p>
              </div>
            )}
          </div>
        </div>

        {/* Similar products */}
        {similar.length > 0 && (
          <section className="mt-20">
            <h2 className="font-serif-display text-3xl font-bold mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
              {similar.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}

        {/* Related articles */}
        {relatedArticles.length > 0 && (
          <section className="mt-20">
            <h2 className="font-serif-display text-3xl font-bold mb-8">Related Style Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map((a) => <ArticleCard key={a.id} article={a} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
