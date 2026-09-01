import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Plus, Eye, Edit, FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
  const session = await requireAdmin();
  if (!session) redirect("/auth/login?callbackUrl=/admin/articles");

  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
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
              <h1 className="text-2xl font-bold">Articles</h1>
              <p className="text-sm text-neutral-500">{articles.length} articles</p>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-neutral-900 text-white px-5 py-2.5 text-sm font-semibold uppercase tracking-widest hover:bg-neutral-800">
            <Plus className="w-4 h-4" /> New Article
          </button>
        </div>

        <div className="bg-white border border-neutral-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="p-4 text-left text-xs uppercase tracking-widest text-neutral-500">Title</th>
                <th className="p-4 text-left text-xs uppercase tracking-widest text-neutral-500">Category</th>
                <th className="p-4 text-left text-xs uppercase tracking-widest text-neutral-500">Author</th>
                <th className="p-4 text-left text-xs uppercase tracking-widest text-neutral-500">Status</th>
                <th className="p-4 text-left text-xs uppercase tracking-widest text-neutral-500">Date</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a) => (
                <tr key={a.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-neutral-400" />
                      <div>
                        <p className="font-medium">{a.title}</p>
                        <p className="text-xs text-neutral-400">/{a.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-neutral-600">{a.category?.name || "—"}</td>
                  <td className="p-4 text-neutral-600">{a.author}</td>
                  <td className="p-4">
                    <span className={`text-[10px] px-2 py-0.5 uppercase tracking-wider ${a.published ? "bg-emerald-100 text-emerald-800" : "bg-neutral-100 text-neutral-600"}`}>
                      {a.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="p-4 text-neutral-500 text-xs">{a.publishedAt ? formatDate(a.publishedAt) : "—"}</td>
                  <td className="p-4">
                    <div className="flex gap-2 justify-end">
                      <Link href={`/style-guides/${a.slug}`} className="p-2 hover:bg-neutral-100" title="View">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button className="p-2 hover:bg-neutral-100" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
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
