import { prisma } from "../db";

export async function trackPageView(data: {
  path: string;
  sessionId?: string;
  referrer?: string;
  userAgent?: string;
  ipAddress?: string;
}) {
  try {
    await prisma.pageView.create({
      data: {
        path: data.path,
        sessionId: data.sessionId,
        referrer: data.referrer,
      },
    });
  } catch (e) {
    console.error("Failed to track page view:", e);
  }
}

export async function trackSearch(data: {
  query: string;
  sessionId?: string;
  results: number;
}) {
  try {
    await prisma.searchLog.create({
      data: data,
    });
  } catch (e) {
    console.error("Failed to track search:", e);
  }
}

export interface AnalyticsSummary {
  totalClicks: number;
  totalProducts: number;
  totalUsers: number;
  totalArticles: number;
  topProducts: Array<{ id: string; name: string; brand: string; clicks: number }>;
  topCategories: Array<{ name: string; count: number }>;
  topSources: Array<{ source: string; count: number }>;
  recentClicks: Array<{ timestamp: Date; count: number }>;
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const [totalProducts, totalUsers, totalArticles, clicksAgg, topProductsRaw, topCatRaw, topSrcRaw, recentClicksRaw] = await Promise.all([
    prisma.product.count(),
    prisma.user.count(),
    prisma.article.count({ where: { published: true } }),
    prisma.affiliateClick.count(),
    prisma.affiliateClick.groupBy({
      by: ["productId"],
      _count: { productId: true },
      orderBy: { _count: { productId: "desc" } },
      take: 10,
    }),
    prisma.product.groupBy({
      by: ["categoryId"],
      _count: { categoryId: true },
      orderBy: { _count: { categoryId: "desc" } },
      take: 10,
    }),
    prisma.affiliateClick.groupBy({
      by: ["source"],
      _count: { source: true },
      orderBy: { _count: { source: "desc" } },
    }),
    prisma.affiliateClick.findMany({
      select: { timestamp: true },
      orderBy: { timestamp: "desc" },
      take: 100,
    }),
  ]);

  const topProducts = await Promise.all(
    topProductsRaw.map(async (p) => {
      const prod = await prisma.product.findUnique({ where: { id: p.productId } });
      return {
        id: p.productId,
        name: prod?.name || "Unknown",
        brand: prod?.brand || "",
        clicks: p._count.productId,
      };
    })
  );

  const topCategories = await Promise.all(
    topCatRaw.map(async (c) => {
      const cat = await prisma.category.findUnique({ where: { id: c.categoryId } });
      return { name: cat?.name || "Unknown", count: c._count.categoryId };
    })
  );

  // Group recent clicks by day for trends
  const dayMap = new Map<string, number>();
  for (const c of recentClicksRaw) {
    const day = c.timestamp.toISOString().split("T")[0];
    dayMap.set(day, (dayMap.get(day) || 0) + 1);
  }
  const recentClicks = Array.from(dayMap.entries())
    .map(([date, count]) => ({ timestamp: new Date(date), count }))
    .slice(0, 7);

  return {
    totalClicks: clicksAgg,
    totalProducts,
    totalUsers,
    totalArticles,
    topProducts,
    topCategories,
    topSources: topSrcRaw.map((s) => ({ source: s.source, count: s._count.source })),
    recentClicks,
  };
}
