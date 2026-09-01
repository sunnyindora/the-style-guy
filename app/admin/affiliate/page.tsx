import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { ArrowLeft, Check, X } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminAffiliatePage() {
  const session = await requireAdmin();
  if (!session) redirect("/auth/login?callbackUrl=/admin/affiliate");

  const settings = await prisma.affiliateSetting.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="p-2 hover:bg-neutral-200">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Affiliate Networks</h1>
            <p className="text-sm text-neutral-500">Manage your affiliate network integrations</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {settings.map((s) => (
            <div key={s.id} className="bg-white border border-neutral-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg">{s.name}</h3>
                  <p className="text-xs uppercase tracking-widest text-neutral-500">{s.source}</p>
                </div>
                <span className={`flex items-center gap-1 text-[10px] px-2 py-1 uppercase tracking-wider ${s.active ? "bg-emerald-100 text-emerald-800" : "bg-neutral-100 text-neutral-600"}`}>
                  {s.active ? <><Check className="w-3 h-3" /> Active</> : <><X className="w-3 h-3" /> Inactive</>}
                </span>
              </div>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-neutral-100 pb-2">
                  <dt className="text-neutral-500">Affiliate ID / Tag</dt>
                  <dd className="font-mono text-xs">{s.affiliateId || "—"}</dd>
                </div>
                <div className="flex justify-between border-b border-neutral-100 pb-2">
                  <dt className="text-neutral-500">Campaign ID</dt>
                  <dd className="font-mono text-xs">{s.campaignId || "—"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-neutral-500">Tracking Param</dt>
                  <dd className="font-mono text-xs">{s.trackingParam || "—"}</dd>
                </div>
              </dl>
              <button className="mt-5 w-full border border-neutral-900 text-neutral-900 py-2 text-xs uppercase tracking-widest hover:bg-neutral-900 hover:text-white transition-colors">
                Configure
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-neutral-900 text-white">
          <h3 className="font-bold mb-2">Setup Guide</h3>
          <p className="text-sm text-neutral-400 leading-relaxed">
            Configure each affiliate network with your own tracking ID and API keys in the <code className="bg-neutral-800 px-1.5 py-0.5 rounded">.env</code> file. Never commit your secrets to version control. Demo networks use placeholder tracking IDs. Affiliate links are automatically routed through <code className="bg-neutral-800 px-1.5 py-0.5 rounded">/go/[productId]</code> which tracks clicks before redirecting.
          </p>
        </div>
      </div>
    </div>
  );
}
