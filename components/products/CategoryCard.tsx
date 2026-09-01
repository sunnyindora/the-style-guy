"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { Category } from "@prisma/client";

interface CategoryCardProps {
  category: Category & { _count?: { products: number } };
  productCount?: number;
}

export function CategoryCard({ category, productCount }: CategoryCardProps) {
  const [imgError, setImgError] = useState(false);
  const count = productCount ?? category._count?.products ?? 0;

  const fallbackImages: Record<string, string> = {
    shirts: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80",
    "t-shirts": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    trousers: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80",
    jeans: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80",
    jackets: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
    sneakers: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    "formal-shoes": "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&q=80",
    watches: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    sunglasses: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80",
    wallets: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80",
    bags: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
    grooming: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80",
  };

  const imgSrc =
    imgError || !category.image
      ? fallbackImages[category.slug] || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80"
      : category.image;

  return (
    <Link
      href={`/category/${category.slug}`}
      className="group relative block aspect-[4/5] overflow-hidden bg-neutral-900"
    >
      <Image
        src={imgSrc}
        alt={category.name}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
        className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-60"
        onError={() => setImgError(true)}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 text-white">
        <h3 className="text-xl md:text-2xl font-bold uppercase tracking-widest mb-1">
          {category.name}
        </h3>
        <p className="text-xs tracking-widest uppercase text-white/80">
          {count} {count === 1 ? "Product" : "Products"}
        </p>
        <div className="w-12 h-px bg-white mt-3 transition-all duration-300 group-hover:w-20" />
      </div>
    </Link>
  );
}
