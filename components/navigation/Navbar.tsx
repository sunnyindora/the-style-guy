"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Search, Heart, User, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  {
    label: "Clothing",
    href: "#",
    children: [
      { label: "Shirts", href: "/category/shirts" },
      { label: "T-Shirts", href: "/category/t-shirts" },
      { label: "Trousers", href: "/category/trousers" },
      { label: "Jeans", href: "/category/jeans" },
      { label: "Jackets", href: "/category/jackets" },
    ],
  },
  {
    label: "Shoes",
    href: "#",
    children: [
      { label: "Sneakers", href: "/category/sneakers" },
      { label: "Formal Shoes", href: "/category/formal-shoes" },
    ],
  },
  { label: "Watches", href: "/category/watches" },
  {
    label: "Accessories",
    href: "#",
    children: [
      { label: "Sunglasses", href: "/category/sunglasses" },
      { label: "Wallets", href: "/category/wallets" },
      { label: "Bags", href: "/category/bags" },
    ],
  },
  { label: "Grooming", href: "/category/grooming" },
  { label: "Outfit Ideas", href: "/outfit-builder" },
  { label: "Style Guides", href: "/style-guides" },
  { label: "Deals", href: "/deals" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      <div className="bg-neutral-900 text-white text-center py-2 text-[11px] tracking-[0.2em] uppercase">
        Free Shipping Over ₹999 • Best Price Guaranteed
      </div>
      <header
        className={cn(
          "sticky top-0 z-50 bg-white transition-all duration-300",
          scrolled ? "shadow-sm border-b border-neutral-200" : "border-b border-neutral-200"
        )}
      >
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-4 md:gap-8">
              <button
                className="md:hidden p-2 -ml-2"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <Link href="/" className="flex flex-col items-start">
                <span className="text-lg md:text-xl font-black tracking-[0.2em] uppercase text-neutral-900">
                  THE STYLE GUY
                </span>
                <span className="hidden md:block text-[9px] tracking-[0.3em] uppercase text-neutral-500 -mt-1">
                  Your Style. Your Rules.
                </span>
              </Link>
            </div>

            <nav className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "px-3 py-2 text-xs font-semibold uppercase tracking-widest transition-colors hover:text-neutral-900",
                      pathname === item.href ? "text-neutral-900" : "text-neutral-600"
                    )}
                  >
                    {item.label}
                  </Link>
                  {item.children && activeDropdown === item.label && (
                    <div className="absolute top-full left-0 min-w-[200px] bg-white border border-neutral-200 shadow-lg py-2 z-50">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <div className="flex items-center gap-1 md:gap-2">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 hover:bg-neutral-100 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <Link href="/wishlist" className="p-2 hover:bg-neutral-100 transition-colors hidden sm:block" aria-label="Wishlist">
                <Heart className="w-5 h-5" />
              </Link>
              <Link href="/account" className="p-2 hover:bg-neutral-100 transition-colors" aria-label="Account">
                <User className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-neutral-200 bg-white">
            <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-4">
              <form onSubmit={handleSearch} className="flex items-center gap-4">
                <Search className="w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for shirts, sneakers, watches, brands..."
                  className="flex-1 text-lg outline-none placeholder:text-neutral-400"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="text-sm uppercase tracking-widest text-neutral-500 hover:text-neutral-900"
                >
                  Close
                </button>
              </form>
            </div>
          </div>
        )}

        {mobileOpen && (
          <div className="md:hidden border-t border-neutral-200 bg-white max-h-[calc(100vh-5rem)] overflow-y-auto">
            <nav className="flex flex-col py-2">
              {NAV_ITEMS.map((item) => (
                <div key={item.label}>
                  {item.children ? (
                    <details className="group">
                      <summary className="flex items-center justify-between px-6 py-3 text-sm font-semibold uppercase tracking-widest cursor-pointer list-none">
                        {item.label}
                        <span className="text-neutral-400 group-open:rotate-180 transition-transform">+</span>
                      </summary>
                      <div className="bg-neutral-50">
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className="block px-10 py-3 text-sm text-neutral-700 hover:bg-neutral-100"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </details>
                  ) : (
                    <Link
                      href={item.href}
                      className="block px-6 py-3 text-sm font-semibold uppercase tracking-widest text-neutral-900 hover:bg-neutral-100"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
