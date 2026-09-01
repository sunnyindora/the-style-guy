# THE STYLE GUY

**Your Style. Your Rules.**

A premium, production-ready full-stack men's fashion affiliate platform built with Next.js 16, TypeScript, Tailwind CSS v4, PostgreSQL, Prisma and Auth.js.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06b6d4)
![Prisma](https://img.shields.io/badge/Prisma-5-2d3748)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791)

---

## ✨ Features

- **Premium editorial design** – magazine-style men's fashion aesthetic
- **Product catalog** across 12 categories (Shirts, T-Shirts, Jeans, Sneakers, Watches, etc.)
- **Advanced search & filtering** – price, brand, rating, discount, store, color, size
- **Outfit Builder** – interactive "Build Your Look" tool by occasion
- **Product comparison** – side-by-side comparison with Best Value / Our Pick badges
- **Affiliate tracking** – abstracted provider layer supporting Amazon, Flipkart, Cuelinks, EarnKaro
- **Affiliate redirect system** (`/go/[productId]`) – tracks clicks anonymously before redirecting
- **Admin dashboard** – stats, product/article/affiliate management
- **Authentication** – credentials-based with role-based access (USER/ADMIN)
- **SEO-first** – dynamic metadata, Open Graph, Twitter cards, JSON-LD (Product, Article, BreadcrumbList, Organization, WebSite), sitemap & robots
- **Analytics-ready** – page views, searches, affiliate clicks
- **Responsive** – mobile-first, works on all screen sizes
- **Secure** – env-based secrets, CSRF, input validation via Zod, hashed passwords

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 14+ (local or remote: Supabase, Neon, Railway, etc.)

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env and add your DATABASE_URL and AUTH_SECRET

# 3. Generate Prisma client & push schema to DB
npx prisma generate
npx prisma db push

# 4. Seed the database with demo data
npm run db:seed

# 5. Run dev server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

**Default Admin credentials:**
- Email: `admin@thestyleguy.com`
- Password: `admin123`

---

## 📁 Project Structure

```
the-style-guy/
├── app/                         # App Router (Next.js 16)
│   ├── page.tsx                 # Homepage
│   ├── shop/                    # Shop listing with filters
│   ├── product/[slug]/          # Product detail pages
│   ├── category/[slug]/         # Category pages
│   ├── style-guides/            # Editorial articles
│   ├── outfit-builder/          # Interactive outfit builder
│   ├── compare/                 # Product comparison
│   ├── deals/                   # Deals page
│   ├── go/[productId]/          # Affiliate redirect endpoint
│   ├── admin/                   # Admin dashboard (protected)
│   ├── api/                     # Route handlers
│   │   ├── auth/                # NextAuth & register
│   │   ├── products/            # Products API with faceted search
│   │   └── admin/stats/         # Admin analytics
│   ├── auth/{login,register}/   # Auth pages
│   ├── about/, /contact/, etc.  # Info pages
│   ├── sitemap.ts, robots.ts    # SEO
│   └── layout.tsx               # Root layout
├── components/
│   ├── ui/                      # Button, Input, Badge
│   ├── layout/                  # Footer
│   ├── navigation/              # Navbar
│   ├── products/                # ProductCard, CategoryCard
│   ├── articles/                # ArticleCard
│   └── outfits/, comparison/    # Feature components
├── lib/
│   ├── db.ts                    # Prisma client singleton
│   ├── auth.ts                  # Auth.js config
│   ├── utils.ts                 # cn, formatPrice, etc.
│   ├── affiliate/provider.ts    # AffiliateProvider abstraction
│   ├── analytics/tracker.ts     # Analytics helpers
│   └── seo/metadata.ts          # SEO utilities & schemas
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── seed.ts                  # Demo seed script
├── public/                      # Static assets
├── types/                       # Shared TS types
├── .env.example                 # Environment template
└── README.md
```

---

## 🗄️ Database Setup

### Local PostgreSQL (with Docker, easy)

```bash
docker run --name thestyleguy-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=thestyleguy \
  -p 5432:5432 -d postgres:15
```

Then set in `.env`:
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/thestyleguy?schema=public"
```

### Using a cloud provider

Supabase / Neon / Railway provide free Postgres instances — just paste the connection string into `DATABASE_URL`.

### Prisma commands

```bash
npx prisma generate       # Generate client
npx prisma db push        # Push schema to DB (dev)
npx prisma migrate dev    # Create & run migrations
npm run db:seed           # Seed demo data
npx prisma studio         # Open DB GUI
```

---

## 🔗 Affiliate Integration

The affiliate system is abstracted behind a `BaseAffiliateProvider` class in `lib/affiliate/provider.ts`. To add a new network:

1. Create a new class extending `BaseAffiliateProvider`
2. Implement `generateAffiliateLink()`
3. Register it in the `providers` map
4. Add credentials to `.env` and enable via Admin → Affiliate

Supported out of the box: Amazon Associates, Flipkart Affiliate, Cuelinks, EarnKaro.

**How redirects work:** All product CTA buttons link to `/go/[productId]`, which:
1. Looks up the product & affiliate settings
2. Records an `AffiliateClick` (product, source, session, referrer, UTM params, timestamp)
3. Sets a session cookie
4. Generates the tracking-tagged affiliate URL
5. 302-redirects to the retailer

Secrets are **never exposed** client-side.

---

## 🔐 Authentication

- Credentials provider (email + password, hashed with bcrypt)
- JWT sessions via Auth.js v5
- Role-based access: `USER` and `ADMIN`
- Protected admin routes via `requireAdmin()` helper

Additional OAuth providers (Google, etc.) can be added in `lib/auth.ts`.

---

## 🔍 SEO

- Dynamic `metadata` on every page (title, description, canonical, OG, Twitter)
- JSON-LD structured data:
  - `Product` + `Offer` + `AggregateRating` on product pages
  - `Article` on style guide pages
  - `BreadcrumbList` across pages
  - `Organization` and `WebSite` site-wide
- `/sitemap.xml` auto-generated with products, articles, categories, static pages
- `/robots.txt` configured to disallow `/admin`, `/go/`
- Clean URL structure: `/product/slug`, `/category/slug`, `/style-guides/slug`

---

## 📈 Analytics

The architecture is analytics-ready. The following events are tracked:

| Event | Model |
|-------|-------|
| Page views | `PageView` |
| Search queries | `SearchLog` |
| Affiliate link clicks | `AffiliateClick` |

To extend, add records in route handlers / API endpoints. Hook up to your analytics provider (GA4, Plausible, etc.) by adding client-side events.

---

## 🚢 Deployment

### Vercel (recommended)

1. Push to GitHub
2. Connect repo to Vercel
3. Add environment variables (`DATABASE_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_SITE_URL`, affiliate keys)
4. Run `prisma generate && prisma db push && npm run db:seed` as part of the build (already configured in build script)
5. Deploy

### Self-hosted

```bash
npm run build
npm start
```

Run behind a reverse proxy (Nginx/Caddy) with SSL.

---

## 🧪 Development Notes

- **Server Components** are used by default; client components are marked with `"use client"` only where interactivity is needed.
- Image optimization via `next/image` with Unsplash/Amazon/Flipkart remote patterns configured.
- Demo products use clearly marked sample affiliate URLs — replace with real product feeds in production.
- Cache-Control headers are set on product API responses (s-maxage=60, SWR=300).
- No fake reviews, fake scarcity or fake urgency — keeping with the premium editorial promise.

---

## 📜 License & Legal

The code is provided as-is for educational and commercial use. The bundled sample product data uses publicly available product facts; replace with real/authorized affiliate feeds in production.

Affiliate disclosure must remain visible to users (built-in on homepage + dedicated page).

---

## 📮 Questions

See `/contact` on the site, or open an issue in the repo.

**THE STYLE GUY — Your Style. Your Rules.**
