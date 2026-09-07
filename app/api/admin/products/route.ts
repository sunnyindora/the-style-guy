import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";

const bodySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  brand: z.string().min(1),
  categoryId: z.string().min(1),
  description: z.string().default(""),
  price: z.coerce.number().positive(),
  originalPrice: z.coerce.number().positive().optional(),
  image: z.string().min(1),
  store: z.string().min(1),
  affiliateUrl: z.string().min(1),
  featured: z.boolean().default(false),
  trending: z.boolean().default(false),
});

function slugify(value: string): string {
  const base = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${base}-${Math.random().toString(36).slice(2, 8)}`;
}

function sourceFor(url: string): "EARNKARO" | "MANUAL" {
  return /ekaro\.in|earnkaro/i.test(url) ? "EARNKARO" : "MANUAL";
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid payload", issues: parsed.error.issues }, { status: 400 });
  }
  const b = parsed.data;
  const originalPrice = b.originalPrice && b.originalPrice >= b.price ? b.originalPrice : b.price;
  const discount = originalPrice > b.price ? Math.round((1 - b.price / originalPrice) * 100) : 0;

  const product = await prisma.product.create({
    data: {
      name: b.name,
      slug: slugify(b.name),
      brand: b.brand,
      categoryId: b.categoryId,
      description: b.description,
      price: b.price,
      originalPrice,
      discount,
      image: b.image,
      images: [b.image],
      store: b.store,
      affiliateUrl: b.affiliateUrl,
      source: sourceFor(b.affiliateUrl),
      featured: b.featured,
      trending: b.trending,
    },
  });
  return NextResponse.json({ ok: true, id: product.id });
}

export async function PUT(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid payload", issues: parsed.error.issues }, { status: 400 });
  }
  const b = parsed.data;
  if (!b.id) return NextResponse.json({ error: "missing id" }, { status: 400 });
  const originalPrice = b.originalPrice && b.originalPrice >= b.price ? b.originalPrice : b.price;
  const discount = originalPrice > b.price ? Math.round((1 - b.price / originalPrice) * 100) : 0;

  const product = await prisma.product.update({
    where: { id: b.id },
    data: {
      name: b.name,
      brand: b.brand,
      categoryId: b.categoryId,
      description: b.description,
      price: b.price,
      originalPrice,
      discount,
      image: b.image,
      store: b.store,
      affiliateUrl: b.affiliateUrl,
      source: sourceFor(b.affiliateUrl),
      featured: b.featured,
      trending: b.trending,
    },
  });
  return NextResponse.json({ ok: true, id: product.id });
}

export async function DELETE(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
