import { constructMetadata } from "@/lib/seo/metadata";

export const metadata = constructMetadata({ title: "Affiliate Disclosure" });

export default function AffiliateDisclosurePage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <p className="text-[11px] tracking-[0.3em] uppercase text-neutral-500 mb-3">Legal</p>
      <h1 className="font-serif-display text-5xl md:text-6xl font-bold mb-8">Affiliate Disclosure</h1>

      <div className="prose prose-lg max-w-none text-neutral-800 space-y-5">
        <p className="text-lg leading-relaxed border-l-4 border-neutral-900 pl-6 py-2 bg-neutral-50 italic">
          <strong>The Style Guy participates in affiliate programs.</strong> We may earn a commission when you purchase through links on our website, at no additional cost to you.
        </p>

        <h2 className="font-serif-display text-3xl font-bold mt-10 mb-4">What This Means</h2>
        <p>
          When you click a link on THE STYLE GUY that leads to a partner store (such as Amazon, Flipkart, Myntra, or others) and make a purchase, we may receive a small commission from that retailer.
        </p>
        <p>
          This commission comes from the retailer — <strong>not from you</strong>. You pay exactly the same price, whether you click our affiliate link or go directly to the store. In some cases, our readers may even get access to exclusive discounts through our partnerships.
        </p>

        <h2 className="font-serif-display text-3xl font-bold mt-10 mb-4">Our Commitment to You</h2>
        <p>We hold editorial independence sacred. Our product recommendations are based on:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Genuine product quality and value</li>
          <li>Brand reputation and customer reviews</li>
          <li>Style versatility and wardrobe utility</li>
          <li>Our editorial team's honest assessment</li>
        </ul>
        <p>
          We do <strong>not</strong> recommend products we wouldn't wear ourselves, and we never let commission rates influence which products we feature. If a product isn't good, we won't link to it — period.
        </p>

        <h2 className="font-serif-display text-3xl font-bold mt-10 mb-4">Affiliate Networks We Work With</h2>
        <p>THE STYLE GUY may participate in the following affiliate programs:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Amazon Associates</li>
          <li>Flipkart Affiliate</li>
          <li>Cuelinks</li>
          <li>EarnKaro</li>
          <li>Direct partnerships with select brands</li>
        </ul>

        <h2 className="font-serif-display text-3xl font-bold mt-10 mb-4">Questions?</h2>
        <p>
          If you have any questions about our affiliate relationships, please contact us at <a href="mailto:hello@thestyleguy.com" className="underline">hello@thestyleguy.com</a>.
        </p>

        <p className="text-sm text-neutral-500 mt-12">Last updated: September 2025</p>
      </div>
    </div>
  );
}
