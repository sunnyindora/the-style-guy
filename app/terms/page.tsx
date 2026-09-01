import { constructMetadata } from "@/lib/seo/metadata";

export const metadata = constructMetadata({ title: "Terms of Service" });

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <p className="text-[11px] tracking-[0.3em] uppercase text-neutral-500 mb-3">Legal</p>
      <h1 className="font-serif-display text-5xl font-bold mb-8">Terms of Service</h1>
      <div className="prose prose-lg max-w-none text-neutral-800 space-y-5">
        <p>By using THE STYLE GUY, you agree to these terms.</p>
        <h2 className="font-serif-display text-2xl font-bold mt-8 mb-3">Use of Content</h2>
        <p>All content on this site is for informational purposes. We may earn commissions from affiliate links.</p>
        <h2 className="font-serif-display text-2xl font-bold mt-8 mb-3">No Warranty</h2>
        <p>Product information, prices, and availability are provided on an "as is" basis. We strive for accuracy but cannot guarantee that all information is current. Prices and availability change frequently — please verify on the retailer's site before purchasing.</p>
        <h2 className="font-serif-display text-2xl font-bold mt-8 mb-3">External Links</h2>
        <p>We link to external retailer websites. We are not responsible for the content, policies, or practices of those sites.</p>
        <h2 className="font-serif-display text-2xl font-bold mt-8 mb-3">Account Responsibility</h2>
        <p>You are responsible for maintaining the confidentiality of your account credentials.</p>
        <p className="text-sm text-neutral-500 mt-10">Last updated: September 2025</p>
      </div>
    </div>
  );
}
