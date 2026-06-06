/**
 * SchemaScript 組件 - 在 React 中安全地注入 JSON-LD Schema
 */

import { useEffect } from "react";

interface SchemaScriptProps {
  schema: Record<string, any>;
  id?: string;
}

/**
 * 使用此組件在頁面中注入 JSON-LD 結構化數據
 * 
 * 使用示例：
 * ```tsx
 * import { SchemaScript } from "@/components/SchemaScript";
 * import { generateOrganizationSchema } from "@/lib/schema";
 * 
 * export default function Home() {
 *   return (
 *     <>
 *       <SchemaScript schema={generateOrganizationSchema()} id="org-schema" />
 *       <div>Page content...</div>
 *     </>
 *   );
 * }
 * ```
 */
export function SchemaScript({ schema, id = "schema-script" }: SchemaScriptProps) {
  useEffect(() => {
    // 創建 script 標籤
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = id;
    script.textContent = JSON.stringify(schema);

    // 添加到 head
    document.head.appendChild(script);

    // 清理函數：組件卸載時移除 script
    return () => {
      const existingScript = document.getElementById(id);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [schema, id]);

  // 此組件不渲染任何 DOM 元素
  return null;
}
