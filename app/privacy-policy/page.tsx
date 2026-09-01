import { constructMetadata } from "@/lib/seo/metadata";

export const metadata = constructMetadata({ title: "Privacy Policy" });

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <p className="text-[11px] tracking-[0.3em] uppercase text-neutral-500 mb-3">Legal</p>
      <h1 className="font-serif-display text-5xl font-bold mb-8">Privacy Policy</h1>
      <div className="prose prose-lg max-w-none text-neutral-800 space-y-5">
        <p>Your privacy is important to us. This policy explains what information we collect and how we use it.</p>
        <h2 className="font-serif-display text-2xl font-bold mt-8 mb-3">Information We Collect</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Account information (name, email) when you register</li>
          <li>Anonymous analytics: pages visited, search queries, clicks on affiliate links</li>
          <li>Session information to understand how the site is used</li>
        </ul>
        <h2 className="font-serif-display text-2xl font-bold mt-8 mb-3">How We Use Information</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>To improve website content and product recommendations</li>
          <li>To track affiliate link conversions (anonymously)</li>
          <li>To personalize your experience</li>
        </ul>
        <h2 className="font-serif-display text-2xl font-bold mt-8 mb-3">Cookies</h2>
        <p>We use minimal cookies for session management and analytics. You can disable cookies in your browser settings.</p>
        <h2 className="font-serif-display text-2xl font-bold mt-8 mb-3">Data Sharing</h2>
        <p>We do not sell your personal information. When you click an affiliate link, you are subject to that retailer's privacy policy.</p>
        <p className="text-sm text-neutral-500 mt-10">Last updated: September 2025</p>
      </div>
    </div>
  );
}
