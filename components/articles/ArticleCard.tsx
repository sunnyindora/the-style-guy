"use client";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { useState } from "react";

interface ArticleLike {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  author: string;
  readingTime: number;
  publishedAt?: Date | null;
  category?: { name: string } | null;
}

interface ArticleCardProps {
  article: ArticleLike;
  variant?: "default" | "featured" | "horizontal";
}

export function ArticleCard({ article, variant = "default" }: ArticleCardProps) {
  const [imgError, setImgError] = useState(false);
  const categoryName = article.category?.name || "Style Guide";

  const fallback = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80";
  const img = imgError ? fallback : article.featuredImage || fallback;

  if (variant === "featured") {
    return (
      <Link href={`/style-guides/${article.slug}`} className="group block relative overflow-hidden aspect-[16/10] md:aspect-[21/9] bg-neutral-900">
        <Image
          src={img}
          alt={article.title}
          fill
          sizes="100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-70"
          onError={() => setImgError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.3em] mb-3 text-amber-400">{categoryName}</p>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">{article.title}</h2>
          <p className="text-white/80 line-clamp-2 mb-4 max-w-2xl">{article.excerpt}</p>
          <div className="flex items-center gap-4 text-xs uppercase tracking-widest text-white/70">
            <span>By {article.author}</span>
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
      </Link>
    );
  }

  if (variant === "horizontal") {
    return (
      <Link href={`/style-guides/${article.slug}`} className="group flex gap-4 py-4 border-b border-neutral-200">
        <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 overflow-hidden bg-neutral-100">
          <Image
            src={img}
            alt={article.title}
            fill
            sizes="128px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-1">{categoryName}</p>
          <h3 className="text-sm md:text-base font-semibold text-neutral-900 line-clamp-2 group-hover:underline underline-offset-2 decoration-1">
            {article.title}
          </h3>
          <p className="text-xs text-neutral-500 mt-1">{article.readingTime} min read</p>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/style-guides/${article.slug}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100 mb-4">
        <Image
          src={img}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgError(true)}
        />
      </div>
      <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-2">{categoryName}</p>
      <h3 className="text-lg font-semibold text-neutral-900 line-clamp-2 group-hover:underline underline-offset-2 decoration-1 mb-2">
        {article.title}
      </h3>
      <p className="text-sm text-neutral-600 line-clamp-2 mb-3">{article.excerpt}</p>
      <div className="flex items-center gap-3 text-xs text-neutral-500 uppercase tracking-wider">
        <span>{article.readingTime} min</span>
        {article.publishedAt && <span>• {formatDate(article.publishedAt)}</span>}
      </div>
    </Link>
  );
}
