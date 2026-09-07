import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import { Plus, ArrowLeft, Edit, Eye } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const session = await requireAdmin();
  if (!session) redirect("/auth/login?callbackUrl=/admin/products");

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
    take: 100,
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 hover:bg-neutral-200">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Products</h1>
              <p className="text-sm text-neutral-500">{products.length} products</p>
            </div>
          </div>
          <Link href="/admin/products/new" className="flex items-center gap-2 bg-neutral-900 text-white px-5 py-2.5 text-sm font-semibold uppercase tracking-widest hover:bg-neutral-800">
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        </div>

        <div className="bg-white border border-neutral-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="p-4 text-left text-xs uppercase tracking-widest text-neutral-500">Product</th>
                <th className="p-4 text-left text-xs uppercase tracking-widest text-neutral-500">Brand</th>
                <th className="p-4 text-left text-xs uppercase tracking-widest text-neutral-500">Category</th>
                <th className="p-4 text-left text-xs uppercase tracking-widest text-neutral-500">Price</th>
                <th className="p-4 text-left text-xs uppercase tracking-widest text-neutral-500">Store</th>
                <th className="p-4 text-left text-xs uppercase tracking-widest text-neutral-500">Status</th>
                <th className="p-4 text-xs uppercase tracking-widest text-neutral-500"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-14 bg-neutral-100 flex-shrink-0">
                        <Image src={p.image} alt={p.name} fill sizes="48px" className="object-cover" />
                      </div>
                      <div>
                        <p className="font-medium line-clamp-1 max-w-xs">{p.name}</p>
                        <p className="text-xs text-neutral-400">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-neutral-600">{p.brand}</td>
                  <td className="p-4 text-neutral-600">{p.category?.name}</td>
                  <td className="p-4 font-semibold">{formatPrice(p.price)}</td>
                  <td className="p-4 text-neutral-600">{p.store}</td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      {p.featured && <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-800 uppercase tracking-wider">Featured</span>}
                      {p.trending && <span className="text-[10px] px-2 py-0.5 bg-red-100 text-red-800 uppercase tracking-wider">Trending</span>}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 justify-end">
                      <Link href={`/product/${p.slug}`} className="p-2 hover:bg-neutral-100" title="View">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link href={`/admin/products/${p.id}/edit`} className="p-2 hover:bg-neutral-100" title="Edit">
                        <Edit className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
