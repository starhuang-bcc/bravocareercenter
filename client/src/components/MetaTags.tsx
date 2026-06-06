/**
 * MetaTags 組件 - 在 React 中動態設置 Meta 標籤
 * 用於 Open Graph 和 Twitter Card 標籤
 */

import { useEffect } from "react";
import { MetaConfig, generateAllMeta } from "@/lib/meta";

interface MetaTagsProps {
  config: Partial<MetaConfig>;
}

/**
 * 使用此組件在頁面中動態設置 Meta 標籤
 * 
 * 使用示例：
 * ```tsx
 * import { MetaTags } from "@/components/MetaTags";
 * 
 * export default function Services() {
 *   return (
 *     <>
 *       <MetaTags config={{
 *         title: "我們的服務 | Bravo Career Center",
 *         description: "了解我們提供的專業獵才、人才外包和生涯諮詢服務",
 *         url: "https://bravocareercenter.com/services",
 *         image: "https://example.com/services-image.jpg",
 *       }} />
 *       <div>Page content...</div>
 *     </>
 *   );
 * }
 * ```
 */
export function MetaTags({ config }: MetaTagsProps) {
  useEffect(() => {
    // 生成所有 Meta 標籤
    const allMeta = generateAllMeta(config);

    // 移除舊的 Meta 標籤（避免重複）
    const existingMeta = document.querySelectorAll(
      'meta[property^="og:"], meta[name^="twitter:"], meta[name="description"]'
    );
    existingMeta.forEach((meta) => meta.remove());

    // 添加新的 Meta 標籤
    allMeta.forEach((meta) => {
      const element = document.createElement("meta");
      if ("property" in meta) {
        element.setAttribute("property", meta.property);
      } else if ("name" in meta) {
        element.setAttribute("name", meta.name);
      }
      element.setAttribute("content", meta.content);
      document.head.appendChild(element);
    });

    // 更新頁面標題
    if (config.title) {
      document.title = config.title;
    }

    // 清理函數
    return () => {
      // 不需要清理，因為下一次渲染會覆蓋
    };
  }, [config]);

  // 此組件不渲染任何 DOM 元素
  return null;
}
