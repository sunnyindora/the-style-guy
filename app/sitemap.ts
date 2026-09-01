import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl.replace(/\/$/, "");
  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "daily", priority: 1 },
    { url: `${base}/shop`, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/outfit-builder`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/style-guides`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/deals`, changeFrequency: "daily", priority: 0.7 },
    { url: `${base}/compare`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/about`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/contact`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/affiliate-disclosure`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/privacy-policy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/category/shirts`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/category/t-shirts`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/category/trousers`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/category/jeans`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/category/jackets`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/category/sneakers`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/category/formal-shoes`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/category/watches`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/category/sunglasses`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/category/wallets`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/category/bags`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/category/grooming`, changeFrequency: "weekly", priority: 0.7 },
  ];

  try {
    const [products, articles, categories] = await Promise.all([
      prisma.product.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.article.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      prisma.category.findMany({ select: { slug: true } }),
    ]);

    for (const p of products) {
      staticUrls.push({ url: `${base}/product/${p.slug}`, lastModified: p.updatedAt, changeFrequency: "weekly", priority: 0.8 });
    }
    for (const a of articles) {
      staticUrls.push({ url: `${base}/style-guides/${a.slug}`, lastModified: a.updatedAt, changeFrequency: "monthly", priority: 0.6 });
    }
    for (const c of categories) {
      staticUrls.push({ url: `${base}/category/${c.slug}`, changeFrequency: "weekly", priority: 0.7 });
    }
  } catch {
    // DB not available at build time — return static URLs only
  }

  return staticUrls;
}
