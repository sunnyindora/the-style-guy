"use client";

import { useState, type FormEvent } from "react";

export interface ProductFormInitial {
  id: string;
  name: string;
  brand: string;
  categoryId: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  store: string;
  affiliateUrl: string;
  featured: boolean;
  trending: boolean;
}

interface Props {
  initial: ProductFormInitial | null;
  categories: { id: string; name: string }[];
}

const input =
  "w-full border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900";
const label = "block text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-1";

export default function ProductForm({ initial, categories }: Props) {
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    brand: initial?.brand ?? "",
    categoryId: initial?.categoryId ?? categories[0]?.id ?? "",
    description: initial?.description ?? "",
    price: initial ? String(initial.price) : "",
    originalPrice: initial ? String(initial.originalPrice) : "",
    image: initial?.image ?? "",
    store: initial?.store ?? "Myntra",
    affiliateUrl: initial?.affiliateUrl ?? "",
    featured: initial?.featured ?? false,
    trending: initial?.trending ?? false,
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const set = (key: string, value: string | boolean) => setForm((f) => ({ ...f, [key]: value }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/products", {
      method: initial ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: initial?.id,
        name: form.name,
        brand: form.brand,
        categoryId: form.categoryId,
        description: form.description,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        image: form.image,
        store: form.store,
        affiliateUrl: form.affiliateUrl,
        featured: form.featured,
        trending: form.trending,
      }),
    });
    if (res.ok) {
      window.location.href = "/admin/products";
      return;
    }
    const data = await res.json().catch(() => ({}));
    setError(data.error ? JSON.stringify(data.error) : "Save nahi hua — fields check karo");
    setSaving(false);
  }

  return (
    <form onSubmit={onSubmit} className="bg-white border border-neutral-200 p-6 grid gap-4 max-w-3xl">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <span className={label}>Product name</span>
          <input className={input} value={form.name} onChange={(e) => set("name", e.target.value)} required />
        </div>
        <div>
          <span className={label}>Brand</span>
          <input className={input} value={form.brand} onChange={(e) => set("brand", e.target.value)} required />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <span className={label}>Category</span>
          <select className={input} value={form.categoryId} onChange={(e) => set("categoryId", e.target.value)}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <span className={label}>Price (₹)</span>
          <input className={input} type="number" min="1" value={form.price} onChange={(e) => set("price", e.target.value)} required />
        </div>
        <div>
          <span className={label}>Original price (₹, optional)</span>
          <input className={input} type="number" min="1" value={form.originalPrice} onChange={(e) => set("originalPrice", e.target.value)} />
        </div>
      </div>

      <div>
        <span className={label}>⭐ AFFILIATE URL (EarnKaro profit link yahan paste karo)</span>
        <input
          className={input}
          value={form.affiliateUrl}
          onChange={(e) => set("affiliateUrl", e.target.value)}
          placeholder="https://ekaro.in/..."
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <span className={label}>Store</span>
          <input className={input} value={form.store} onChange={(e) => set("store", e.target.value)} placeholder="Myntra / Ajio / Amazon" required />
        </div>
        <div>
          <span className={label}>Image URL</span>
          <input className={input} value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="https://..." required />
        </div>
      </div>

      <div>
        <span className={label}>Description</span>
        <textarea className={input} rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} />
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.trending} onChange={(e) => set("trending", e.target.checked)} />
          Trending
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="bg-neutral-900 text-white px-6 py-2.5 text-sm font-semibold uppercase tracking-widest hover:bg-neutral-800 disabled:opacity-50 w-fit"
      >
        {saving ? "Saving..." : initial ? "Save Changes" : "Add Product"}
      </button>
    </form>
  );
}
