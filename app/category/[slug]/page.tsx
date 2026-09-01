import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/products/ProductCard";
import { constructMetadata } from "@/lib/seo/metadata";
import { safeQuery } from "@/lib/safe-query";

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const categories = await prisma.category.findMany({ select: { slug: true } });
    return categories.map((c) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

async function getCategory(slug: string) {
  return safeQuery(async () => {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: { _count: { select: { products: true } } },
    });
    if (!category) return null;
    const products = await prisma.product.findMany({
      where: { categoryId: category.id, availability: true },
      orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
      include: { category: true },
    });
    return { category, products };
  }, null as any);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getCategory(slug);
  if (!data) return constructMetadata({ title: "Category Not Found" });
  return constructMetadata({
    title: `Men's ${data.category.name} — Shop Online`,
    description: `Shop the best men's ${data.category.name.toLowerCase()} online. Compare prices across Amazon, Flipkart and more. Top brands, best deals.`,
    canonical: `/category/${data.category.slug}`,
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getCategory(slug);
  if (!data) notFound();
  const { category, products } = data;

  return (
    <div>
      <div className="relative h-[40vh] min-h-[300px] bg-neutral-900 overflow-hidden">
        <img
          src={category.image || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80"}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="relative z-10 h-full max-w-[1600px] mx-auto px-6 md:px-12 flex flex-col justify-end pb-10">
          <p className="text-[11px] tracking-[0.3em] uppercase text-amber-400 mb-2">Category</p>
          <h1 className="font-serif-display text-5xl md:text-7xl font-bold text-white">
            {category.name}
          </h1>
          <p className="text-white/80 mt-3">{products.length} products</p>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-12">
        {products.length === 0 ? (
          <p className="text-center text-neutral-500 py-20">No products in this category yet. Seed the database to see demo products.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {products.map((p: any) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
