import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { ArrowLeft } from "lucide-react";
import ProductForm from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const session = await requireAdmin();
  if (!session) redirect("/auth/login?callbackUrl=/admin/products");

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/products" className="p-2 hover:bg-neutral-200">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Add Product</h1>
            <p className="text-sm text-neutral-500">Naya product + EarnKaro affiliate link</p>
          </div>
        </div>
        <ProductForm initial={null} categories={categories.map((c) => ({ id: c.id, name: c.name }))} />
      </div>
    </div>
  );
}
