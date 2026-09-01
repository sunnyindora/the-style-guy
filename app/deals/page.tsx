import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/products/ProductCard";
import { constructMetadata } from "@/lib/seo/metadata";
import { safeQuery } from "@/lib/safe-query";

export const metadata = constructMetadata({
  title: "Best Deals & Discounts on Men's Fashion",
  description: "Today's best deals on men's clothing, sneakers, watches, accessories and grooming. Handpicked discounts up to 70% off across top stores.",
});

export const revalidate = 300;

export default async function DealsPage() {
  const deals = await safeQuery(() => prisma.product.findMany({
    where: { availability: true, discount: { gte: 20 } },
    orderBy: { discount: "desc" },
    include: { category: true },
  }), [] as any[]);

  const topDeals = deals.filter((p) => p.discount >= 40);
  const regularDeals = deals.filter((p) => p.discount < 40);

  return (
    <div>
      <div className="bg-gradient-to-r from-red-700 to-red-900 text-white py-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center">
          <p className="text-[11px] tracking-[0.4em] uppercase text-amber-300 mb-4">Limited Time</p>
          <h1 className="font-serif-display text-5xl md:text-7xl font-bold mb-4">Best Deals</h1>
          <p className="text-white/80 max-w-xl mx-auto">
            Handpicked discounts on top men's fashion. Save more on the brands and styles you love.
          </p>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-12">
        {topDeals.length > 0 && (
          <section className="mb-16">
            <div className="mb-8">
              <p className="text-[11px] tracking-[0.3em] uppercase text-red-700 font-bold mb-2">Mega Savings — 40%+ Off</p>
              <h2 className="font-serif-display text-3xl md:text-4xl font-bold">Top Deals Today</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
              {topDeals.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}

        {regularDeals.length > 0 && (
          <section>
            <div className="mb-8">
              <h2 className="font-serif-display text-3xl md:text-4xl font-bold">More Great Offers</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
              {regularDeals.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}

        {deals.length === 0 && (
          <p className="text-center text-neutral-500 py-20">No deals available right now. Check back soon!</p>
        )}
      </div>
    </div>
  );
}
