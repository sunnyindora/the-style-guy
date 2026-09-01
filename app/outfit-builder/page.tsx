"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, ArrowRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice, cn } from "@/lib/utils";
import { constructMetadata } from "@/lib/seo/metadata";

// These metadata will be applied by a wrapper since this is a client component.
// We'll use a server component wrapper below.

type Occasion = "casual" | "office" | "date" | "wedding" | "party" | "travel" | "smart-casual";

const OCCASIONS: { id: Occasion; label: string; emoji: string; description: string }[] = [
  { id: "casual", label: "Casual", emoji: "👕", description: "Relaxed everyday looks" },
  { id: "office", label: "Office", emoji: "💼", description: "Professional & sharp" },
  { id: "date", label: "Date Night", emoji: "🌹", description: "Impress effortlessly" },
  { id: "wedding", label: "Wedding", emoji: "💒", description: "Celebration ready" },
  { id: "party", label: "Party", emoji: "🎉", description: "Bold night-out looks" },
  { id: "travel", label: "Travel", emoji: "✈️", description: "Comfort meets style" },
  { id: "smart-casual", label: "Smart Casual", emoji: "✨", description: "The perfect balance" },
];

const STEPS = [
  { key: "occasion", label: "Occasion" },
  { key: "shirt", label: "Top" },
  { key: "trousers", label: "Bottom" },
  { key: "shoes", label: "Shoes" },
  { key: "watch", label: "Watch" },
  { key: "accessories", label: "Accessories" },
];

// Static sample products for outfit builder
const PRODUCTS = {
  shirt: [
    { id: "shirt-1", name: "Classic White Oxford Shirt", brand: "Peter England", price: 1299, image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=500&q=80" },
    { id: "shirt-2", name: "Navy Blue Shirt", brand: "Louis Philippe", price: 1499, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80" },
    { id: "shirt-3", name: "White Crew Neck Tee", brand: "H&M", price: 499, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80" },
    { id: "shirt-4", name: "Black Satin Shirt", brand: "Jack & Jones", price: 1799, image: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=500&q=80" },
    { id: "shirt-5", name: "Light Blue Polo", brand: "U.S. Polo", price: 899, image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500&q=80" },
  ],
  trousers: [
    { id: "tr-1", name: "Beige Chinos", brand: "U.S. Polo", price: 1299, image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&q=80" },
    { id: "tr-2", name: "Dark Blue Slim Jeans", brand: "Levi's", price: 1999, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80" },
    { id: "tr-3", name: "Grey Formal Trousers", brand: "Raymond", price: 1499, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&q=80" },
    { id: "tr-4", name: "Black Skinny Jeans", brand: "Jack & Jones", price: 1499, image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80" },
  ],
  shoes: [
    { id: "sh-1", name: "White Classic Sneakers", brand: "Nike", price: 3499, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80" },
    { id: "sh-2", name: "Black Oxford Shoes", brand: "Bata", price: 2499, image: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=500&q=80" },
    { id: "sh-3", name: "Brown Leather Loafers", brand: "Clarks", price: 3499, image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=500&q=80" },
    { id: "sh-4", name: "Vans Old Skool", brand: "Vans", price: 2999, image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&q=80" },
  ],
  watch: [
    { id: "w-1", name: "Minimalist Black Watch", brand: "Daniel Wellington", price: 6999, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80" },
    { id: "w-2", name: "Chronograph Watch", brand: "Casio Edifice", price: 4999, image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&q=80" },
    { id: "w-3", name: "Diver Automatic", brand: "Seiko", price: 12999, image: "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=500&q=80" },
  ],
  accessories: [
    { id: "a-1", name: "Wayfarer Sunglasses", brand: "Ray-Ban", price: 4999, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80" },
    { id: "a-2", name: "Aviator Sunglasses", brand: "Ray-Ban", price: 5499, image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80" },
    { id: "a-3", name: "Black Leather Wallet", brand: "Fossil", price: 1499, image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80" },
    { id: "a-4", name: "Black Leather Backpack", brand: "Wildcraft", price: 2499, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80" },
  ],
};

type CategoryKey = "shirt" | "trousers" | "shoes" | "watch" | "accessories";

interface SelectedItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
}

export default function OutfitBuilderPage() {
  const [occasion, setOccasion] = useState<Occasion | null>(null);
  const [step, setStep] = useState(0);
  const [selection, setSelection] = useState<Record<CategoryKey, SelectedItem | null>>({
    shirt: null,
    trousers: null,
    shoes: null,
    watch: null,
    accessories: null,
  });

  useEffect(() => {
    if (occasion) setStep(1);
  }, [occasion]);

  const total = Object.values(selection).reduce((sum, item) => sum + (item?.price || 0), 0);
  const allSelected = occasion && selection.shirt && selection.trousers && selection.shoes;
  const categories: CategoryKey[] = ["shirt", "trousers", "shoes", "watch", "accessories"];

  function pickItem(cat: CategoryKey, item: SelectedItem) {
    setSelection((prev) => ({ ...prev, [cat]: item }));
    // Auto-advance after selection
    const idx = categories.indexOf(cat);
    if (idx < categories.length - 1) {
      setStep(idx + 2);
    } else {
      setStep(6);
    }
  }

  function reset() {
    setOccasion(null);
    setStep(0);
    setSelection({ shirt: null, trousers: null, shoes: null, watch: null, accessories: null });
  }

  return (
    <div>
      <div className="bg-neutral-950 text-white py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center">
          <p className="text-[11px] tracking-[0.4em] uppercase text-amber-400 mb-4">Interactive Tool</p>
          <h1 className="font-serif-display text-5xl md:text-7xl font-bold mb-6">Build Your Look</h1>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            Pick your occasion and build a complete outfit — every piece shoppable with the best price available.
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-12">
        {/* Steps */}
        <div className="hidden md:flex items-center justify-center gap-2 mb-12 overflow-x-auto">
          {STEPS.map((s, i) => (
            <div key={s.key} className="flex items-center">
              <div
                className={cn(
                  "w-8 h-8 flex items-center justify-center text-xs font-semibold border-2",
                  i <= step ? "bg-neutral-900 text-white border-neutral-900" : "border-neutral-300 text-neutral-400"
                )}
              >
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={cn("ml-2 text-sm uppercase tracking-widest", i <= step ? "text-neutral-900 font-semibold" : "text-neutral-400")}>
                {s.label}
              </span>
              {i < STEPS.length - 1 && <div className={cn("w-8 h-px mx-3", i < step ? "bg-neutral-900" : "bg-neutral-300")} />}
            </div>
          ))}
        </div>

        {/* Step 0: Occasion */}
        {step === 0 && (
          <div>
            <h2 className="text-center font-serif-display text-3xl font-bold mb-8">Where are you going?</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {OCCASIONS.map((occ) => (
                <button
                  key={occ.id}
                  onClick={() => setOccasion(occ.id)}
                  className={cn(
                    "p-6 border-2 transition-all text-left hover:border-neutral-900 group",
                    occasion === occ.id ? "border-neutral-900 bg-neutral-50" : "border-neutral-200"
                  )}
                >
                  <div className="text-3xl mb-3">{occ.emoji}</div>
                  <div className="font-bold text-lg mb-1">{occ.label}</div>
                  <div className="text-xs text-neutral-500">{occ.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Item selection steps */}
        {step >= 1 && step <= 5 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif-display text-2xl md:text-3xl font-bold">
                Pick your {STEPS[step].label.toLowerCase()}
              </h2>
              <button onClick={reset} className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900">
                <RefreshCw className="w-4 h-4" /> Start Over
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {PRODUCTS[categories[step - 1]].map((item) => {
                const current = selection[categories[step - 1]];
                const selected = current?.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => pickItem(categories[step - 1], item)}
                    className={cn(
                      "group relative border transition-all text-left overflow-hidden",
                      selected ? "border-neutral-900 ring-2 ring-neutral-900" : "border-neutral-200 hover:border-neutral-400"
                    )}
                  >
                    <div className="relative aspect-[3/4] bg-neutral-100">
                      <Image src={item.image} alt={item.name} fill sizes="200px" className="object-cover" />
                      {selected && (
                        <div className="absolute top-2 right-2 w-7 h-7 bg-neutral-900 text-white flex items-center justify-center">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-[10px] uppercase tracking-widest text-neutral-500">{item.brand}</p>
                      <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                      <p className="text-sm font-semibold mt-1">{formatPrice(item.price)}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Jump to step */}
            <div className="flex flex-wrap gap-2 mt-8 justify-center">
              {STEPS.slice(1).map((s, i) => (
                <button
                  key={s.key}
                  onClick={() => setStep(i + 1)}
                  disabled={i > 0 && !selection[categories[i - 1]]}
                  className={cn(
                    "px-4 py-2 text-xs uppercase tracking-widest border",
                    step === i + 1 ? "bg-neutral-900 text-white border-neutral-900" : "border-neutral-300 hover:border-neutral-900 disabled:opacity-40"
                  )}
                >
                  {s.label}
                </button>
              ))}
              <button
                onClick={() => setStep(6)}
                className={cn(
                  "px-4 py-2 text-xs uppercase tracking-widest border",
                  step === 6 ? "bg-neutral-900 text-white border-neutral-900" : "border-neutral-300 hover:border-neutral-900"
                )}
              >
                Complete Look
              </button>
            </div>
          </div>
        )}

        {/* Final look */}
        {step === 6 && allSelected && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif-display text-3xl md:text-4xl font-bold">Your Complete Look</h2>
              <button onClick={reset} className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900">
                <RefreshCw className="w-4 h-4" /> Build Another
              </button>
            </div>

            <div className="bg-neutral-50 border border-neutral-200 p-6 md:p-10">
              <p className="text-[11px] uppercase tracking-[0.3em] text-amber-700 mb-2">Occasion</p>
              <p className="text-2xl font-bold mb-8 capitalize">{occasion?.replace("-", " ")}</p>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
                {Object.entries(selection).map(([key, item]) =>
                  item ? (
                    <div key={key} className="bg-white">
                      <div className="relative aspect-[3/4] bg-neutral-100">
                        <Image src={item.image} alt={item.name} fill sizes="200px" className="object-cover" />
                      </div>
                      <div className="p-3">
                        <p className="text-[10px] uppercase tracking-widest text-neutral-500">{item.brand}</p>
                        <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                        <p className="text-sm font-semibold mt-1">{formatPrice(item.price)}</p>
                      </div>
                    </div>
                  ) : (
                    <div key={key} className="flex items-center justify-center aspect-[3/4] border-2 border-dashed border-neutral-300 text-neutral-400 text-xs uppercase tracking-widest">
                      Optional
                    </div>
                  )
                )}
              </div>

              <div className="border-t border-neutral-200 pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-neutral-500 uppercase tracking-widest mb-1">Total Look Value</p>
                  <p className="text-4xl font-bold font-serif-display">{formatPrice(total)}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button as="link" href="/shop" variant="outline">Shop Individual Items</Button>
                  <Button>
                    Shop This Look <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>

              <p className="text-xs text-neutral-500 mt-6">
                * Individual items link to their best-price store. Prices and availability are subject to change.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
