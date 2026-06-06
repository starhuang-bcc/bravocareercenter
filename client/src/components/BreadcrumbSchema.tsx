/**
 * BreadcrumbSchema 組件 - 根據當前路由自動生成 BreadcrumbList Schema
 */

import { useLocation } from "wouter";
import { SchemaScript } from "@/components/SchemaScript";
import { generateBreadcrumbSchema } from "@/lib/schema";

interface BreadcrumbItem {
  name: string;
  path: string;
}

const breadcrumbMap: Record<string, BreadcrumbItem[]> = {
  "/": [
    { name: "首頁", path: "/" },
  ],
  "/admin": [
    { name: "首頁", path: "/" },
    { name: "後台登入", path: "/admin" },
  ],
  "/submissions": [
    { name: "首頁", path: "/" },
    { name: "表單提交", path: "/submissions" },
  ],
};

/**
 * 根據當前路由返回麵包屑路徑
 */
function getBreadcrumbsForPath(pathname: string): BreadcrumbItem[] {
  return breadcrumbMap[pathname] || [{ name: "首頁", path: "/" }];
}

/**
 * 將相對路徑轉換為絕對 URL
 */
function getAbsoluteUrl(path: string): string {
  if (typeof window === "undefined") {
    return `https://bravocareercenter.com${path}`;
  }
  return `${window.location.origin}${path}`;
}

export function BreadcrumbSchema() {
  const [pathname] = useLocation();

  // 獲取當前路由的麵包屑
  const breadcrumbs = getBreadcrumbsForPath(pathname);

  // 轉換為 Schema 格式
  const breadcrumbItems = breadcrumbs.map((item) => ({
    name: item.name,
    url: getAbsoluteUrl(item.path),
  }));

  // 只有當有多於一個項目時才生成 Schema
  if (breadcrumbItems.length <= 1) {
    return null;
  }

  const schema = generateBreadcrumbSchema(breadcrumbItems);

  return <SchemaScript schema={schema} id="breadcrumb-schema" />;
}
