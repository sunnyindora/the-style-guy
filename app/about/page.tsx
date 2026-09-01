import { constructMetadata } from "@/lib/seo/metadata";

export const metadata = constructMetadata({ title: "About Us" });

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <p className="text-[11px] tracking-[0.3em] uppercase text-neutral-500 mb-3">About</p>
      <h1 className="font-serif-display text-5xl md:text-6xl font-bold mb-8">The Story of THE STYLE GUY</h1>

      <div className="prose prose-lg max-w-none text-neutral-800 space-y-5">
        <p className="text-xl leading-relaxed">
          <strong>THE STYLE GUY</strong> is on a mission: help men dress better without the confusion, the inflated prices, or the guessing game.
        </p>
        <p>
          Shopping for men's fashion online should be easy. You should know what looks good, what fits well, and where to find the best price — without jumping between ten different websites.
        </p>
        <p>
          That's why we built THE STYLE GUY. A premium men's fashion platform that combines editorial-style advice with smart shopping tools: price comparison, outfit builders, style guides and honest product recommendations.
        </p>

        <h2 className="font-serif-display text-3xl font-bold mt-12 mb-4">What We Do</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Curate the best men's fashion across categories — shirts, jeans, sneakers, watches, accessories and grooming.</li>
          <li>Compare prices across popular stores so you always get the best deal.</li>
          <li>Publish honest, practical style guides written for real men.</li>
          <li>Help you build complete outfits with our interactive Outfit Builder.</li>
          <li>Never use fake scarcity, fake reviews or clickbait tactics.</li>
        </ul>

        <h2 className="font-serif-display text-3xl font-bold mt-12 mb-4">Our Philosophy</h2>
        <p>
          <em>"Your Style. Your Rules."</em> — Fashion isn't about blindly following trends. It's about developing your own taste and wearing what makes you feel confident. We're here to help you build a wardrobe that works for your life, not someone else's idea of it.
        </p>

        <h2 className="font-serif-display text-3xl font-bold mt-12 mb-4">How We Make Money</h2>
        <p>
          THE STYLE GUY participates in affiliate programs. When you click a link and make a purchase, we may earn a small commission — at no additional cost to you. This helps us keep creating free, high-quality content and improving the platform. Our recommendations are never influenced by commission rates.
        </p>
        <p>
          <a href="/affiliate-disclosure" className="underline font-semibold">Read our full affiliate disclosure →</a>
        </p>
      </div>
    </div>
  );
}
