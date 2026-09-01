import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { safeQuery } from "@/lib/safe-query";
import { formatDate } from "@/lib/utils";
import { constructMetadata, articleSchema, breadcrumbSchema } from "@/lib/seo/metadata";

export const revalidate = 300;

async function getArticle(slug: string) {
  return safeQuery(async () => {
    const article = await prisma.article.findUnique({
      where: { slug },
      include: { category: true },
    });
    if (!article || !article.published) return null;
    const related = await prisma.article.findMany({
      where: { published: true, id: { not: article.id }, ...(article.categoryId ? { categoryId: article.categoryId } : {}) },
      orderBy: { publishedAt: "desc" },
      take: 3,
      include: { category: true },
    });
    return { article, related };
  }, null as any);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getArticle(slug);
  if (!data) return constructMetadata({ title: "Not Found", noIndex: true });
  const { article } = data;
  return constructMetadata({
    title: article.title,
    description: article.excerpt,
    image: article.featuredImage,
    canonical: `/style-guides/${article.slug}`,
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getArticle(slug);
  if (!data) notFound();
  const anyData: any = data;
  const article: any = anyData.article;
  const related: any[] = anyData.related || [];

  return (
    <article>
      <div className="max-w-3xl mx-auto px-6 pt-10 pb-6">
        <nav className="text-xs text-neutral-500 mb-6">
          <Link href="/" className="hover:text-neutral-900">Home</Link> /{" "}
          <Link href="/style-guides" className="hover:text-neutral-900">Style Guides</Link> /{" "}
          <span className="text-neutral-900">{article.title}</span>
        </nav>
        <p className="text-[11px] uppercase tracking-[0.3em] text-amber-700 mb-4">
          {article.category?.name || "Style Guide"}
        </p>
        <h1 className="font-serif-display text-4xl md:text-6xl font-bold leading-tight mb-6">
          {article.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-neutral-500 border-b border-neutral-200 pb-6 mb-8">
          <span className="font-medium text-neutral-900">By {article.author}</span>
          <span>•</span>
          <span>{article.readingTime} min read</span>
          {article.publishedAt && (
            <>
              <span>•</span>
              <span>{formatDate(article.publishedAt)}</span>
            </>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mb-10">
        <div className="relative aspect-[16/9] overflow-hidden bg-neutral-100">
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1200px"
            className="object-cover"
          />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-16">
        <div
          className="prose prose-neutral prose-lg max-w-none [&_h2]:font-serif-display [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mt-12 [&_h2]:mb-4 [&_h3]:font-serif-display [&_h3]:text-2xl [&_h3]:font-bold [&_p]:leading-relaxed [&_p]:text-neutral-800 [&_p]:mb-5 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5 [&_li]:mb-2 [&_strong]:font-semibold"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema({
            title: article.title, description: article.excerpt, image: article.featuredImage,
            author: article.author, slug: article.slug, publishedAt: article.publishedAt, updatedAt: article.updatedAt,
          })) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Style Guides", url: "/style-guides" },
            { name: article.title, url: `/style-guides/${article.slug}` },
          ])) }}
        />
      </div>

      {related.length > 0 && (
        <div className="bg-neutral-50 py-16">
          <div className="max-w-[1600px] mx-auto px-6 md:px-12">
            <h2 className="font-serif-display text-3xl font-bold mb-10">More From The Edit</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map((a) => <ArticleCard key={a.id} article={a} />)}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
