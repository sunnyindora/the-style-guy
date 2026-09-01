import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getAnalyticsSummary } from "@/lib/analytics/tracker";

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const summary = await getAnalyticsSummary();
    return NextResponse.json(summary);
  } catch (e) {
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 });
  }
}
