import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-300 mt-24">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-black tracking-[0.2em] uppercase text-white mb-4">
              THE STYLE GUY
            </h3>
            <p className="text-sm text-neutral-400 max-w-sm leading-relaxed mb-6">
              Your Style. Your Rules. Discover men's fashion, compare products across stores, and build your perfect look.
            </p>
            <p className="text-xs text-neutral-500 leading-relaxed max-w-md">
              The Style Guy participates in affiliate programs. We may earn a commission when you purchase through links on our website, at no additional cost to you.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-white mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/category/shirts" className="hover:text-white transition-colors">Shirts</Link></li>
              <li><Link href="/category/t-shirts" className="hover:text-white transition-colors">T-Shirts</Link></li>
              <li><Link href="/category/jeans" className="hover:text-white transition-colors">Jeans</Link></li>
              <li><Link href="/category/sneakers" className="hover:text-white transition-colors">Sneakers</Link></li>
              <li><Link href="/category/watches" className="hover:text-white transition-colors">Watches</Link></li>
              <li><Link href="/deals" className="hover:text-white transition-colors">Best Deals</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-white mb-4">Guides</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/style-guides" className="hover:text-white transition-colors">Style Guides</Link></li>
              <li><Link href="/outfit-builder" className="hover:text-white transition-colors">Outfit Builder</Link></li>
              <li><Link href="/compare" className="hover:text-white transition-colors">Product Comparison</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/affiliate-disclosure" className="hover:text-white transition-colors">Affiliate Disclosure</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-12 pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} THE STYLE GUY. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-neutral-500">
            <span>Made in India</span>
            <span>•</span>
            <span>Prices in INR</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
