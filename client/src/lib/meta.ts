/**
 * Meta 標籤工具函數
 * 用於生成 Open Graph 和 Twitter Card meta 標籤
 */

export interface MetaConfig {
  title: string;
  description: string;
  url: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article" | "business.business";
  locale?: string;
  twitterHandle?: string;
}

const DEFAULT_CONFIG: MetaConfig = {
  title: "築夢人生涯諮詢服務有限公司 | Bravo Career Center",
  description: "提供專業獵才、人才外包、生涯諮詢服務，連結企業與人才，共創職涯與企業發展。",
  url: typeof window !== "undefined" ? window.location.href : "https://bravocareercenter.com",
  image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663726608645/KmSn4imp7E3CjLNAtUxPWq/bravo-logo.png",
  imageAlt: "築夢人生涯諮詢服務有限公司 Logo",
  type: "website",
  locale: "zh_TW",
  twitterHandle: "@bravocareercenter",
};

/**
 * 生成 Open Graph Meta 標籤
 */
export function generateOpenGraphMeta(config: Partial<MetaConfig> = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  return [
    { property: "og:title", content: finalConfig.title },
    { property: "og:description", content: finalConfig.description },
    { property: "og:url", content: finalConfig.url },
    { property: "og:type", content: finalConfig.type || "website" },
    { property: "og:locale", content: finalConfig.locale || "zh_TW" },
    ...(finalConfig.image ? [{ property: "og:image", content: finalConfig.image }] : []),
    ...(finalConfig.imageAlt ? [{ property: "og:image:alt", content: finalConfig.imageAlt }] : []),
  ];
}

/**
 * 生成 Twitter Card Meta 標籤
 */
export function generateTwitterCardMeta(config: Partial<MetaConfig> = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  return [
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: finalConfig.title },
    { name: "twitter:description", content: finalConfig.description },
    ...(finalConfig.image ? [{ name: "twitter:image", content: finalConfig.image }] : []),
    ...(finalConfig.imageAlt ? [{ name: "twitter:image:alt", content: finalConfig.imageAlt }] : []),
    ...(finalConfig.twitterHandle ? [{ name: "twitter:creator", content: finalConfig.twitterHandle }] : []),
  ];
}

/**
 * 生成標準 Meta 標籤（title, description）
 */
export function generateStandardMeta(config: Partial<MetaConfig> = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  return [
    { name: "description", content: finalConfig.description },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
  ];
}

/**
 * 合併所有 Meta 標籤
 */
export function generateAllMeta(config: Partial<MetaConfig> = {}) {
  return [
    ...generateStandardMeta(config),
    ...generateOpenGraphMeta(config),
    ...generateTwitterCardMeta(config),
  ];
}

/**
 * 獲取默認配置
 */
export function getDefaultMetaConfig(): MetaConfig {
  return DEFAULT_CONFIG;
}
