import type { Metadata } from "next";
import { prisma } from "../db";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const siteName = "THE STYLE GUY";
const defaultDescription =
  "Your Style. Your Rules. Discover men's fashion, compare products, and build your perfect look. Shop shirts, jeans, sneakers, watches, accessories and grooming products.";

export function constructMetadata({
  title,
  description = defaultDescription,
  image = "/images/og-default.jpg",
  canonical,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
  noIndex?: boolean;
} = {}): Metadata {
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  return {
    title: fullTitle,
    description,
    metadataBase: new URL(siteUrl),
    alternates: { canonical: canonical || siteUrl },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical || siteUrl,
      siteName,
      images: [{ url: image, width: 1200, height: 630, alt: siteName }],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
  };
}

export function productSchema(product: {
  name: string;
  brand: string;
  description: string;
  image: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  slug: string;
  store: string;
  availability: boolean;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    brand: { "@type": "Brand", name: product.brand },
    description: product.description,
    image: product.image,
    sku: product.slug,
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/product/${product.slug}`,
      priceCurrency: "INR",
      price: product.price,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      availability: product.availability
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: product.store },
    },
    aggregateRating:
      product.reviewCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
          }
        : undefined,
  };
}

export function articleSchema(article: {
  title: string;
  description: string;
  image: string;
  author: string;
  slug: string;
  publishedAt?: Date | null;
  updatedAt: Date;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: article.image,
    author: { "@type": "Person", name: article.author },
    publisher: {
      "@type": "Organization",
      name: siteName,
      logo: { "@type": "ImageObject", url: `${siteUrl}/icons/logo.png` },
    },
    datePublished: article.publishedAt?.toISOString() || article.updatedAt.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    mainEntityOfPage: `${siteUrl}/style-guides/${article.slug}`,
  };
}

export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${siteUrl}${item.url}`,
    })),
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
    logo: `${siteUrl}/icons/logo.png`,
    description: defaultDescription,
    slogan: "Your Style. Your Rules.",
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/shop?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export async function generateSitemap(): Promise<string> {
  const base = siteUrl.replace(/\/$/, "");
  const staticUrls = [
    "", "/shop", "/outfit-builder", "/style-guides", "/deals", "/compare",
    "/about", "/contact", "/affiliate-disclosure", "/privacy-policy", "/terms",
    "/clothing/shirts", "/clothing/t-shirts", "/clothing/trousers", "/clothing/jeans",
    "/clothing/jackets", "/shoes/sneakers", "/shoes/formal-shoes", "/watches",
    "/accessories/sunglasses", "/accessories/wallets", "/accessories/bags",
    "/grooming",
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (const u of staticUrls) {
    xml += `  <url><loc>${base}${u}</loc><changefreq>daily</changefreq><priority>${u === "" ? "1.0" : "0.7"}</priority></url>\n`;
  }

  try {
    const [products, articles, categories] = await Promise.all([
      prisma.product.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.article.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      prisma.category.findMany({ select: { slug: true } }),
    ]);

    for (const p of products) {
      xml += `  <url><loc>${base}/product/${p.slug}</loc><lastmod>${p.updatedAt.toISOString().split("T")[0]}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>\n`;
    }
    for (const a of articles) {
      xml += `  <url><loc>${base}/style-guides/${a.slug}</loc><lastmod>${a.updatedAt.toISOString().split("T")[0]}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>\n`;
    }
    for (const c of categories) {
      xml += `  <url><loc>${base}/category/${c.slug}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>\n`;
    }
  } catch {}

  xml += `</urlset>`;
  return xml;
}
