import { prisma } from "@/lib/db";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { constructMetadata } from "@/lib/seo/metadata";
import { safeQuery } from "@/lib/safe-query";

export const metadata = constructMetadata({
  title: "Style Guides for Men",
  description: "Men's style guides, fashion tips, outfit ideas and grooming advice. Expert advice on dressing sharp for every occasion.",
});

export const revalidate = 300;

export default async function StyleGuidesPage() {
  const articles = await safeQuery(() => prisma.article.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    include: { category: true },
  }), [] as any[]);
  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <div>
      <div className="bg-neutral-950 text-white py-20 md:py-28">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 text-center">
          <p className="text-[11px] tracking-[0.4em] uppercase text-amber-400 mb-4">The Magazine</p>
          <h1 className="font-serif-display text-5xl md:text-7xl font-bold mb-6">The Style Edit</h1>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            Men's fashion guides, styling tips and outfit ideas — curated to help you dress better every day.
          </p>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-16">
        {featured && (
          <div className="mb-16">
            <ArticleCard article={featured} variant="featured" />
          </div>
        )}

        {rest.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {rest.map((article) => <ArticleCard key={article.id} article={article} />)}
          </div>
        )}

        {articles.length === 0 && (
          <p className="text-center text-neutral-500 py-20">Articles coming soon.</p>
        )}
      </div>
    </div>
  );
}
