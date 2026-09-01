"use client";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 text-center">
      <Heart className="w-12 h-12 mx-auto mb-6 text-neutral-400" />
      <h1 className="font-serif-display text-4xl font-bold mb-4">Your Wishlist</h1>
      <p className="text-neutral-600 mb-8">Sign in to save your favorite products and view them across devices.</p>
      <div className="flex gap-4 justify-center">
        <Button as="link" href="/auth/login">Sign In</Button>
        <Button as="link" href="/shop" variant="outline">Browse Products</Button>
      </div>
    </div>
  );
}
