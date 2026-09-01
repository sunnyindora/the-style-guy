import { NextResponse } from "next/server";
import { getAffiliateRedirect } from "@/lib/affiliate/provider";
import { prisma } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;
  const url = new URL(request.url);
  const { searchParams } = url;
  const reqHeaders = new Headers(request.headers);

  // Try to get session ID from cookie or header
  const cookieHeader = reqHeaders.get("cookie") || "";
  const sessionMatch = cookieHeader.match(/tsg_session=([^;]+)/);
  const sessionId = sessionMatch ? sessionMatch[1] : searchParams.get("sid") || undefined;

  const referrer = reqHeaders.get("referer") || searchParams.get("ref") || undefined;
  const userAgent = reqHeaders.get("user-agent") || undefined;
  const ipAddress = reqHeaders.get("x-forwarded-for")?.split(",")[0] || undefined;

  const campaign = searchParams.get("campaign") || undefined;
  const utmSource = searchParams.get("utm_source") || undefined;
  const utmMedium = searchParams.get("utm_medium") || undefined;
  const utmCampaign = searchParams.get("utm_campaign") || undefined;

  // First check if productId is a slug or id
  let product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    product = await prisma.product.findUnique({ where: { slug: productId } });
  }

  if (!product) {
    return NextResponse.redirect(new URL("/shop?error=product-not-found", request.url));
  }

  const redirectUrl = await getAffiliateRedirect(product.id, {
    sessionId: sessionId ?? undefined,
    referrer: referrer ?? undefined,
    campaign: campaign ?? undefined,
    utmSource: utmSource ?? undefined,
    utmMedium: utmMedium ?? undefined,
    utmCampaign: utmCampaign ?? undefined,
    ipAddress: ipAddress ?? undefined,
    userAgent: userAgent ?? undefined,
  });

  if (!redirectUrl) {
    return NextResponse.redirect(new URL(`/product/${product.slug}?error=no-link`, request.url));
  }

  // Set session cookie if not present
  const response = NextResponse.redirect(redirectUrl);
  if (!sessionId) {
    const newSid = "session_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    response.cookies.set("tsg_session", newSid, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "lax",
    });
  }
  return response;
}
