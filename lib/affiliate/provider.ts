import { AffiliateSource } from "@prisma/client";
import { prisma } from "../db";

export interface AffiliateProduct {
  id?: string;
  externalId: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  images?: string[];
  store: string;
  category: string;
  sizes?: string[];
  colors?: string[];
  rating?: number;
  material?: string;
  pros?: string[];
  cons?: string[];
}

export interface AffiliateLinkResult {
  url: string;
  source: AffiliateSource;
  campaign?: string;
}

export abstract class BaseAffiliateProvider {
  abstract source: AffiliateSource;
  abstract name: string;

  abstract generateAffiliateLink(
    productUrl: string,
    campaignId?: string,
    trackingParam?: string
  ): string;

  async trackClick(data: {
    productId: string;
    sessionId?: string;
    referrer?: string;
    campaign?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    return prisma.affiliateClick.create({
      data: {
        productId: data.productId,
        source: this.source,
        sessionId: data.sessionId,
        referrer: data.referrer,
        campaign: data.campaign,
        utmSource: data.utmSource,
        utmMedium: data.utmMedium,
        utmCampaign: data.utmCampaign,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    });
  }
}

class AmazonProvider extends BaseAffiliateProvider {
  source = AffiliateSource.AMAZON;
  name = "Amazon Associates";

  generateAffiliateLink(productUrl: string, campaignId?: string, trackingParam?: string): string {
    const tag = process.env.AMAZON_AFFILIATE_TAG || "demotag-21";
    try {
      const url = new URL(productUrl);
      url.searchParams.set("tag", trackingParam || tag);
      if (campaignId) url.searchParams.set("camp", campaignId);
      return url.toString();
    } catch {
      return productUrl;
    }
  }
}

class FlipkartProvider extends BaseAffiliateProvider {
  source = AffiliateSource.FLIPKART;
  name = "Flipkart Affiliate";

  generateAffiliateLink(productUrl: string, campaignId?: string, trackingParam?: string): string {
    const affId = process.env.FLIPKART_AFFILIATE_ID || "demoflipkart";
    try {
      const url = new URL(productUrl);
      url.searchParams.set("affid", trackingParam || affId);
      if (campaignId) url.searchParams.set("campaign", campaignId);
      return url.toString();
    } catch {
      return productUrl;
    }
  }
}

class CuelinksProvider extends BaseAffiliateProvider {
  source = AffiliateSource.CUELINKS;
  name = "Cuelinks";

  generateAffiliateLink(productUrl: string, campaignId?: string, trackingParam?: string): string {
    const pubId = process.env.CUELINKS_PUBLISHER_ID || "demo_pub";
    const baseUrl = "https://redirector.cuelinks.com/Redirect";
    return `${baseUrl}?url=${encodeURIComponent(productUrl)}&pubId=${trackingParam || pubId}${campaignId ? `&camp=${campaignId}` : ""}`;
  }
}

class EarnKaroProvider extends BaseAffiliateProvider {
  source = AffiliateSource.EARNKARO;
  name = "EarnKaro";

  generateAffiliateLink(productUrl: string, campaignId?: string, trackingParam?: string): string {
    const affId = process.env.EARNKARO_AFFILIATE_ID || "demo_earnkaro";
    const baseUrl = "https://earnkaro.com/shop";
    return `${baseUrl}?r=${trackingParam || affId}&u=${encodeURIComponent(productUrl)}${campaignId ? `&camp=${campaignId}` : ""}`;
  }
}

class ManualProvider extends BaseAffiliateProvider {
  source = AffiliateSource.MANUAL;
  name = "Manual";

  generateAffiliateLink(productUrl: string): string {
    return productUrl;
  }
}

const providers: Record<AffiliateSource, BaseAffiliateProvider> = {
  [AffiliateSource.AMAZON]: new AmazonProvider(),
  [AffiliateSource.FLIPKART]: new FlipkartProvider(),
  [AffiliateSource.CUELINKS]: new CuelinksProvider(),
  [AffiliateSource.EARNKARO]: new EarnKaroProvider(),
  [AffiliateSource.MANUAL]: new ManualProvider(),
};

export function getAffiliateProvider(source: AffiliateSource): BaseAffiliateProvider {
  return providers[source] || providers[AffiliateSource.MANUAL];
}

export async function getAffiliateRedirect(productId: string, context?: {
  sessionId?: string;
  referrer?: string;
  campaign?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  ipAddress?: string;
  userAgent?: string;
}): Promise<string | null> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) return null;

  const settings = await prisma.affiliateSetting.findUnique({
    where: { source: product.source },
  });

  const provider = getAffiliateProvider(product.source);
  const affiliateUrl = provider.generateAffiliateLink(
    product.affiliateUrl,
    settings?.campaignId ?? context?.campaign,
    settings?.trackingParam ?? undefined
  );

  await provider.trackClick({
    productId: product.id,
    sessionId: context?.sessionId ?? undefined,
    referrer: context?.referrer ?? undefined,
    campaign: context?.campaign ?? undefined,
    utmSource: context?.utmSource ?? undefined,
    utmMedium: context?.utmMedium ?? undefined,
    utmCampaign: context?.utmCampaign ?? undefined,
    ipAddress: context?.ipAddress ?? undefined,
    userAgent: context?.userAgent ?? undefined,
  });

  return affiliateUrl;
}
