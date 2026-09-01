"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ArrowRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, cn } from "@/lib/utils";

// Demo products for comparison (in a real app these would come from search)
const COMPARABLE_PRODUCTS = [
  {
    id: "p1", name: "White Classic Sneakers", brand: "Nike", price: 3499, originalPrice: 4999,
    rating: 4.7, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
    material: "Leather Upper", store: "Nike", bestFor: "Everyday casual",
    pros: ["Versatile styling", "Premium leather", "Comfortable"],
  },
  {
    id: "p2", name: "Old Skool Black/White", brand: "Vans", price: 2999, originalPrice: 3999,
    rating: 4.5, image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&q=80",
    material: "Canvas/Suede", store: "Vans", bestFor: "Streetwear & skate",
    pros: ["Iconic design", "Better price", "Great grip"],
  },
  {
    id: "p3", name: "Ultra Boost Running", brand: "Adidas", price: 7999, originalPrice: 12999,
    rating: 4.8, image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80",
    material: "Primeknit", store: "Adidas", bestFor: "Performance running",
    pros: ["Exceptional comfort", "Premium build", "High cushioning"],
  },
];

type Comparison = typeof COMPARABLE_PRODUCTS[number];

export default function ComparePage() {
  const [selected, setSelected] = useState<string[]>(["p1", "p2"]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const products = COMPARABLE_PRODUCTS.filter((p) => selected.includes(p.id));

  // Determine best value and our pick
  const bestValue = [...products].sort((a, b) => (b.originalPrice - b.price) / b.originalPrice - (a.originalPrice - a.price) / a.originalPrice)[0];
  const ourPick = [...products].sort((a, b) => b.rating - a.rating)[0];

  return (
    <div>
      <div className="bg-neutral-950 text-white py-16 md:py-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center">
          <p className="text-[11px] tracking-[0.4em] uppercase text-amber-400 mb-4">Smart Shopping</p>
          <h1 className="font-serif-display text-5xl md:text-6xl font-bold mb-4">Compare Products</h1>
          <p className="text-white/70 max-w-xl mx-auto">
            Compare up to 3 products side-by-side to find the best value for your style and budget.
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="mb-10">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-4">Pick up to 3 products</h2>
          <div className="flex flex-wrap gap-3">
            {COMPARABLE_PRODUCTS.map((p) => (
              <button
                key={p.id}
                onClick={() => toggle(p.id)}
                className={cn(
                  "px-4 py-2 border text-sm transition-all",
                  selected.includes(p.id)
                    ? "bg-neutral-900 text-white border-neutral-900"
                    : "border-neutral-300 hover:border-neutral-900"
                )}
              >
                {p.brand} — {p.name}
              </button>
            ))}
          </div>
        </div>

        {products.length < 2 ? (
          <div className="text-center py-20 border border-dashed border-neutral-300">
            <p className="text-neutral-500">Select at least 2 products to compare.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-4 w-48 text-xs uppercase tracking-widest text-neutral-500 border-b border-neutral-200">Feature</th>
                  {products.map((p) => (
                    <th key={p.id} className="p-4 border-b border-neutral-200 text-left align-top">
                      <div className="relative">
                        {ourPick?.id === p.id && <Badge variant="pick" className="absolute -top-2 left-0 z-10">Our Pick</Badge>}
                        {bestValue?.id === p.id && ourPick?.id !== p.id && <Badge variant="best" className="absolute -top-2 left-0 z-10">Best Value</Badge>}
                        <div className="relative aspect-square w-full max-w-[200px] bg-neutral-100 mb-3">
                          <Image src={p.image} alt={p.name} fill sizes="200px" className="object-cover" />
                        </div>
                        <p className="text-[10px] uppercase tracking-widest text-neutral-500">{p.brand}</p>
                        <p className="font-semibold text-base mb-2">{p.name}</p>
                        <div className="flex items-center gap-1 mb-3">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={cn("w-3 h-3", i < Math.floor(p.rating) ? "fill-amber-500 text-amber-500" : "text-neutral-300")} />
                          ))}
                          <span className="text-xs text-neutral-500 ml-1">({p.rating})</span>
                        </div>
                        <Button as="link" href={`/go/${p.id}`} size="sm">
                          Check Price <ArrowRight className="ml-1 w-3 h-3" />
                        </Button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <CompareRow label="Current Price">
                  {products.map((p) => (
                    <td key={p.id} className="p-4 border-b border-neutral-200 text-xl font-bold">{formatPrice(p.price)}</td>
                  ))}
                </CompareRow>
                <CompareRow label="Original Price">
                  {products.map((p) => (
                    <td key={p.id} className="p-4 border-b border-neutral-200 text-neutral-500 line-through">{formatPrice(p.originalPrice)}</td>
                  ))}
                </CompareRow>
                <CompareRow label="Discount">
                  {products.map((p) => {
                    const d = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
                    return (
                      <td key={p.id} className="p-4 border-b border-neutral-200 font-semibold text-red-600">{d}% OFF</td>
                    );
                  })}
                </CompareRow>
                <CompareRow label="Rating">
                  {products.map((p) => (
                    <td key={p.id} className="p-4 border-b border-neutral-200">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                        <span className="font-semibold">{p.rating.toFixed(1)}</span>
                      </div>
                    </td>
                  ))}
                </CompareRow>
                <CompareRow label="Material">
                  {products.map((p) => (
                    <td key={p.id} className="p-4 border-b border-neutral-200">{p.material}</td>
                  ))}
                </CompareRow>
                <CompareRow label="Best For">
                  {products.map((p) => (
                    <td key={p.id} className="p-4 border-b border-neutral-200">{p.bestFor}</td>
                  ))}
                </CompareRow>
                <CompareRow label="Store">
                  {products.map((p) => (
                    <td key={p.id} className="p-4 border-b border-neutral-200">{p.store}</td>
                  ))}
                </CompareRow>
                <CompareRow label="Pros">
                  {products.map((p) => (
                    <td key={p.id} className="p-4 border-b border-neutral-200 align-top">
                      <ul className="space-y-1">
                        {p.pros.map((pro, i) => (
                          <li key={i} className="flex items-start gap-1 text-sm text-neutral-700">
                            <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" /> <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </CompareRow>
              </tbody>
            </table>
          </div>
        )}

        <p className="text-xs text-neutral-500 mt-8">
          * Comparison data is based on stored product information and our editorial assessment. Recommendations are objective based on value and rating.
        </p>

        <div className="mt-8 text-center">
          <Link href="/shop" className="text-sm uppercase tracking-widest font-semibold hover:underline">
            Browse all products →
          </Link>
        </div>
      </div>
    </div>
  );
}

function CompareRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr>
      <td className="p-4 border-b border-neutral-200 text-xs uppercase tracking-widest text-neutral-500 font-semibold align-top">{label}</td>
      {children}
    </tr>
  );
}
