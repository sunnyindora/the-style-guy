"use client";
import Link from "next/link";
import Image from "next/image";
import { Heart, Star } from "lucide-react";
import { useState } from "react";
import { cn, formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ProductWithCategory } from "@/types";

interface ProductCardProps {
  product: ProductWithCategory;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const [imgError, setImgError] = useState(false);

  const discountPct =
    product.discount ||
    (product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0);

  const stars = {
    full: Math.floor(product.rating),
    half: product.rating % 1 >= 0.5 ? 1 : 0,
  };

  return (
    <div className="group relative flex flex-col bg-white">
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
        <Link href={`/product/${product.slug}`}>
          <Image
            src={imgError ? "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&q=80" : product.image}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        </Link>

        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {discountPct > 0 && <Badge variant="sale">-{discountPct}%</Badge>}
          {product.trending && <Badge variant="pick">TRENDING</Badge>}
          {product.featured && <Badge variant="best">FEATURED</Badge>}
        </div>

        <button
          onClick={() => setWishlisted(!wishlisted)}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm hover:bg-white transition-colors"
          aria-label="Add to wishlist"
        >
          <Heart
            className={cn(
              "w-4 h-4 transition-colors",
              wishlisted ? "fill-red-500 text-red-500" : "text-neutral-700"
            )}
          />
        </button>
      </div>

      <div className="flex flex-col p-4 gap-2">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-500">
            {product.brand}
          </p>
          <p className="text-[11px] uppercase tracking-wider text-neutral-400">{product.store}</p>
        </div>

        <Link href={`/product/${product.slug}`} className="group/title">
          <h3 className="text-sm font-medium text-neutral-900 line-clamp-2 group-hover/title:underline decoration-1 underline-offset-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-3 h-3",
                i < stars.full ? "fill-amber-500 text-amber-500" : "text-neutral-300"
              )}
            />
          ))}
          <span className="text-xs text-neutral-500 ml-1">({product.reviewCount || 0})</span>
        </div>

        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-base font-semibold text-neutral-900">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-sm text-neutral-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        <Button as="link" href={`/go/${product.id}`} size="sm" className="mt-2 w-full">
          View Deal
        </Button>
      </div>
    </div>
  );
}
