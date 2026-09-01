import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import { LayoutDashboard, Package, FileText, Settings, Users, ExternalLink, TrendingUp, ShoppingBag, MousePointerClick, Eye } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await requireAdmin();
  if (!session) redirect("/auth/login?callbackUrl=/admin");

  const [totalProducts, totalUsers, totalArticles, clicks, topProductsRaw, clicksByDayRaw, clicksBySource] = await Promise.all([
    prisma.product.count(),
    prisma.user.count(),
    prisma.article.count({ where: { published: true } }),
    prisma.affiliateClick.count(),
    prisma.affiliateClick.groupBy({
      by: ["productId"], _count: { productId: true },
      orderBy: { _count: { productId: "desc" } }, take: 5,
    }),
    prisma.affiliateClick.findMany({
      select: { timestamp: true }, orderBy: { timestamp: "desc" }, take: 200,
    }),
    prisma.affiliateClick.groupBy({
      by: ["source"], _count: { source: true },
    }),
  ]);

  const topProducts = await Promise.all(
    topProductsRaw.map(async (p) => {
      const prod = await prisma.product.findUnique({ where: { id: p.productId } });
      return { id: p.productId, name: prod?.name || "Unknown", brand: prod?.brand || "", clicks: p._count.productId };
    })
  );

  const dayMap = new Map<string, number>();
  for (const c of clicksByDayRaw) {
    const day = c.timestamp.toISOString().split("T")[0];
    dayMap.set(day, (dayMap.get(day) || 0) + 1);
  }
  const clickTrend = Array.from(dayMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-7);

  const maxTrend = Math.max(1, ...clickTrend.map((d) => d.count));

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-neutral-950 text-white flex-shrink-0">
        <div className="p-6 border-b border-neutral-800">
          <Link href="/" className="font-black tracking-widest text-sm">THE STYLE GUY</Link>
          <p className="text-[10px] tracking-widest text-neutral-500 mt-1">Admin Dashboard</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <SidebarLink href="/admin" icon={<LayoutDashboard className="w-4 h-4" />} active>
            Dashboard
          </SidebarLink>
          <SidebarLink href="/admin/products" icon={<Package className="w-4 h-4" />}>
            Products
          </SidebarLink>
          <SidebarLink href="/admin/articles" icon={<FileText className="w-4 h-4" />}>
            Articles
          </SidebarLink>
          <SidebarLink href="/admin/affiliate" icon={<Settings className="w-4 h-4" />}>
            Affiliate
          </SidebarLink>
        </nav>
        <div className="p-4 border-t border-neutral-800 text-xs text-neutral-500">
          Signed in as <span className="text-white">{session.user?.name || session.user?.email}</span>
        </div>
      </aside>

      <div className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <Link href="/" className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900">
            <ExternalLink className="w-4 h-4" /> View Site
          </Link>
        </header>

        <div className="p-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={<Package className="w-5 h-5" />} label="Total Products" value={totalProducts.toString()} />
            <StatCard icon={<Users className="w-5 h-5" />} label="Users" value={totalUsers.toString()} />
            <StatCard icon={<FileText className="w-5 h-5" />} label="Articles" value={totalArticles.toString()} />
            <StatCard icon={<MousePointerClick className="w-5 h-5" />} label="Affiliate Clicks" value={clicks.toString()} accent />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Click Trend */}
            <div className="lg:col-span-2 bg-white border border-neutral-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold uppercase tracking-widest text-sm">Click Trends (Last 7 days)</h2>
                <TrendingUp className="w-5 h-5 text-neutral-400" />
              </div>
              {clickTrend.length === 0 ? (
                <p className="text-neutral-500 text-sm py-12 text-center">No clicks yet. Start sharing your links!</p>
              ) : (
                <div className="flex items-end gap-3 h-40">
                  {clickTrend.map((d) => (
                    <div key={d.date} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full bg-neutral-900 transition-all"
                        style={{ height: `${(d.count / maxTrend) * 100}%`, minHeight: d.count > 0 ? "8px" : "2px" }}
                      />
                      <p className="text-[10px] text-neutral-500">{d.date.slice(5)}</p>
                      <p className="text-xs font-semibold">{d.count}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top Sources */}
            <div className="bg-white border border-neutral-200 p-6">
              <h2 className="font-bold uppercase tracking-widest text-sm mb-6">Top Affiliate Sources</h2>
              {clicksBySource.length === 0 ? (
                <p className="text-neutral-500 text-sm">No data yet.</p>
              ) : (
                <ul className="space-y-4">
                  {clicksBySource.map((s) => (
                    <li key={s.source} className="flex justify-between items-center">
                      <span className="text-sm font-medium uppercase">{s.source}</span>
                      <span className="text-sm font-bold">{s._count.source}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Top Products */}
            <div className="lg:col-span-3 bg-white border border-neutral-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold uppercase tracking-widest text-sm">Top Products by Clicks</h2>
                <Link href="/admin/products" className="text-xs text-neutral-500 hover:text-neutral-900 uppercase tracking-widest">Manage Products →</Link>
              </div>
              {topProducts.length === 0 ? (
                <p className="text-neutral-500 text-sm py-8 text-center">No product clicks yet.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200 text-left">
                      <th className="py-3 text-xs uppercase tracking-widest text-neutral-500">Product</th>
                      <th className="py-3 text-xs uppercase tracking-widest text-neutral-500">Brand</th>
                      <th className="py-3 text-xs uppercase tracking-widest text-neutral-500 text-right">Clicks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((p) => (
                      <tr key={p.id} className="border-b border-neutral-100">
                        <td className="py-3 font-medium">{p.name}</td>
                        <td className="py-3 text-neutral-500">{p.brand}</td>
                        <td className="py-3 text-right font-bold">{p.clicks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent?: boolean }) {
  return (
    <div className={cn("bg-white border p-6", accent ? "border-neutral-900" : "border-neutral-200")}>
      <div className={cn("w-10 h-10 flex items-center justify-center mb-4", accent ? "bg-neutral-900 text-white" : "bg-neutral-100")}>
        {icon}
      </div>
      <p className="text-xs uppercase tracking-widest text-neutral-500 mb-1">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

function SidebarLink({ href, icon, children, active }: { href: string; icon: React.ReactNode; children: React.ReactNode; active?: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
        active ? "bg-white text-neutral-900" : "text-neutral-400 hover:text-white hover:bg-neutral-800"
      )}
    >
      {icon}
      {children}
    </Link>
  );
}

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
