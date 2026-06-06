/**
 * Schema.org 結構化數據工具函數
 * 用於生成和管理 JSON-LD 格式的結構化數據
 */

export interface SchemaConfig {
  organizationName: string;
  organizationUrl: string;
  organizationLogo: string;
  organizationEmail: string;
  organizationPhone: string;
  organizationAddress: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  description: string;
  sameAs: string[];
}

const DEFAULT_CONFIG: SchemaConfig = {
  organizationName: "築夢人生涯諮詢服務有限公司",
  organizationUrl: typeof window !== "undefined" ? window.location.origin : "https://bravocareercenter.com",
  organizationLogo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663726608645/KmSn4imp7E3CjLNAtUxPWq/bravo-logo.png",
  organizationEmail: "info@bravocareercenter.com",
  organizationPhone: "+886-2-xxxx-xxxx",
  organizationAddress: {
    streetAddress: "台北市",
    addressLocality: "台北市",
    addressRegion: "台北市",
    postalCode: "100",
    addressCountry: "TW",
  },
  description: "築夢人生涯諮詢服務有限公司（Bravo Career Center）提供專業獵才、人才外包、生涯諮詢服務，連結企業與人才，共創職涯與企業發展。",
  sameAs: [
    "https://www.facebook.com/bravocareercenter",
    "https://www.linkedin.com/company/bravo-career-center",
  ],
};

/**
 * 生成 Organization Schema
 */
export function generateOrganizationSchema(config: Partial<SchemaConfig> = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: finalConfig.organizationName,
    url: finalConfig.organizationUrl,
    logo: finalConfig.organizationLogo,
    description: finalConfig.description,
    email: finalConfig.organizationEmail,
    telephone: finalConfig.organizationPhone,
    address: {
      "@type": "PostalAddress",
      streetAddress: finalConfig.organizationAddress.streetAddress,
      addressLocality: finalConfig.organizationAddress.addressLocality,
      addressRegion: finalConfig.organizationAddress.addressRegion,
      postalCode: finalConfig.organizationAddress.postalCode,
      addressCountry: finalConfig.organizationAddress.addressCountry,
    },
    sameAs: finalConfig.sameAs,
  };
}

/**
 * 生成 LocalBusiness Schema
 */
export function generateLocalBusinessSchema(config: Partial<SchemaConfig> = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: finalConfig.organizationName,
    url: finalConfig.organizationUrl,
    logo: finalConfig.organizationLogo,
    description: finalConfig.description,
    email: finalConfig.organizationEmail,
    telephone: finalConfig.organizationPhone,
    address: {
      "@type": "PostalAddress",
      streetAddress: finalConfig.organizationAddress.streetAddress,
      addressLocality: finalConfig.organizationAddress.addressLocality,
      addressRegion: finalConfig.organizationAddress.addressRegion,
      postalCode: finalConfig.organizationAddress.postalCode,
      addressCountry: finalConfig.organizationAddress.addressCountry,
    },
    priceRange: "$$",
    areaServed: ["TW"],
  };
}

/**
 * 生成 Service Schema
 */
export function generateServiceSchema(
  serviceName: string,
  serviceDescription: string,
  serviceUrl?: string,
  config: Partial<SchemaConfig> = {}
) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: serviceName,
    description: serviceDescription,
    url: serviceUrl || finalConfig.organizationUrl,
    provider: {
      "@type": "Organization",
      name: finalConfig.organizationName,
      url: finalConfig.organizationUrl,
      logo: finalConfig.organizationLogo,
      email: finalConfig.organizationEmail,
      telephone: finalConfig.organizationPhone,
    },
    areaServed: {
      "@type": "Country",
      name: "TW",
    },
    availableLanguage: ["zh-TW", "en"],
  };
}

/**
 * 生成 BreadcrumbList Schema
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * 生成 FAQPage Schema
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * 將 Schema 對象轉換為 JSON-LD 字符串
 */
export function schemaToJsonLd(schema: any): string {
  return JSON.stringify(schema);
}

/**
 * 在頁面中注入 JSON-LD Schema
 */
export function injectSchema(schema: any, id?: string) {
  if (typeof document === "undefined") return;

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = schemaToJsonLd(schema);
  if (id) script.id = id;

  document.head.appendChild(script);
}

/**
 * 移除已注入的 Schema
 */
export function removeSchema(id: string) {
  if (typeof document === "undefined") return;

  const script = document.getElementById(id);
  if (script) script.remove();
}
