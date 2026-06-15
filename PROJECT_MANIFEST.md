# Bravo Career Center - 項目備份清單

## 備份信息
- **備份時間**: 2026-06-15
- **項目名稱**: Bravo Career Center (築夢人生涯諮詢服務有限公司)
- **備份大小**: 105 MB
- **備份文件**: bravo-career-center-backup.tar.gz

## 項目結構

### 前端代碼 (client/)
- pages/ - 頁面組件 (Home.tsx, SubmissionsPage.tsx, AdminLoginPage.tsx)
- components/ - 可重用組件和 UI 庫
- lib/ - tRPC 客戶端、Schema.org 工具、Meta 標籤工具
- hooks/ - 自定義 React Hooks
- App.tsx - 路由和主布局
- index.css - 全局樣式和設計令牌

### 後端代碼 (server/)
- routers.ts - tRPC 路由 (auth、contact.submit、contact.list、contact.delete、contact.deleteMultiple)
- db.ts - 數據庫查詢助手
- storage.ts - S3 文件存儲
- _core/ - 框架核心 (Express、OAuth、通知、LLM、Google Maps)

### 數據庫 (drizzle/)
- schema.ts - 數據庫表定義
- migrations/ - 數據庫遷移文件

### 配置文件
- package.json - 依賴和腳本
- tsconfig.json - TypeScript 配置
- vite.config.ts - Vite 構建配置
- vitest.config.ts - 測試配置
- drizzle.config.ts - 數據庫配置

## 主要功能

### 公開網站
- 首頁展示公司服務
- 服務介紹（專業獵才、人才外包、生涯諮詢）
- 聯絡表單提交
- SEO 優化（Schema.org、Open Graph、Twitter Card）
- 響應式設計

### 後台管理系統
- 密碼保護的後台登錄
- 查看所有聯絡表單提交記錄
- 按分類篩選記錄
- 搜尋功能
- 單個或批量刪除記錄

### 技術特性
- React 19 + TypeScript
- Tailwind CSS 4
- Express 伺服器
- tRPC 類型安全 API
- MySQL/TiDB 數據庫
- Drizzle ORM
- 單元測試 (Vitest)

## 部署信息
- **主域名**: www.bravocareercenter.com
- **備用域名**: bravocareercenter.com
- **Manus 域名**: bravocareers-kmsn4imp.manus.space
- **SSL/HTTPS**: 已啟用
- **Sitemap**: /sitemap.xml

## 恢復說明

### 解壓備份
```bash
tar -xzf bravo-career-center-backup.tar.gz
cd bravo-career-center
```

### 安裝依賴
```bash
pnpm install
```

### 初始化數據庫
```bash
pnpm db:push
```

### 開發模式
```bash
pnpm dev
```

### 生產構建
```bash
pnpm build
```

### 運行測試
```bash
pnpm test
```

## 技術棧
- 前端: React 19 + TypeScript + Tailwind CSS 4
- 後端: Express 4 + tRPC 11
- 數據庫: MySQL/TiDB + Drizzle ORM
- 構建: Vite 7
- 測試: Vitest
- 包管理: pnpm

## 最後更新
- **日期**: 2026-06-15
- **版本**: 174fe4f8
- **最後功能**: 批量刪除功能實現

