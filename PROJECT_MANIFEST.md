# Bravo Career Center - 項目備份清單

## 備份信息
- **備份時間**: 2026-06-16 10:39:26
- **備份文件**: bravo-career-center-backup-20260616-103926.tar.gz
- **備份大小**: 105 MB
- **項目大小**: 571 MB
- **總文件數**: 45,243 個

## 項目結構

```
bravo-career-center/
├── client/                          # 前端應用
│   ├── public/                      # 靜態資源
│   │   ├── favicon.ico
│   │   ├── robots.txt
│   │   └── manifest.json
│   ├── src/
│   │   ├── pages/                   # 頁面組件
│   │   │   ├── Home.tsx
│   │   │   ├── SubmissionsPage.tsx
│   │   │   └── NotFound.tsx
│   │   ├── components/              # 可重用組件
│   │   │   ├── sections/
│   │   │   │   ├── HeroSection.tsx
│   │   │   │   ├── FeaturesSection.tsx
│   │   │   │   ├── ServicesSection.tsx
│   │   │   │   ├── ProcessSection.tsx
│   │   │   │   ├── AboutSection.tsx
│   │   │   │   ├── ContactSection.tsx
│   │   │   │   ├── FAQSection.tsx
│   │   │   │   └── ...
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── MetaTags.tsx
│   │   │   ├── SchemaScript.tsx
│   │   │   └── ...
│   │   ├── hooks/                   # 自定義 hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useScrollAnimation.ts
│   │   │   └── ...
│   │   ├── lib/                     # 工具函數
│   │   │   ├── trpc.ts
│   │   │   ├── schema.ts
│   │   │   ├── meta.ts
│   │   │   └── ...
│   │   ├── contexts/                # React contexts
│   │   ├── App.tsx                  # 主應用組件
│   │   ├── main.tsx                 # 入口文件
│   │   └── index.css                # 全局樣式
│   ├── index.html                   # HTML 模板
│   └── package.json
│
├── server/                          # 後端應用
│   ├── _core/                       # 核心框架
│   │   ├── context.ts
│   │   ├── oauth.ts
│   │   ├── cookies.ts
│   │   ├── llm.ts
│   │   ├── imageGeneration.ts
│   │   ├── voiceTranscription.ts
│   │   ├── notification.ts
│   │   ├── map.ts
│   │   ├── dataApi.ts
│   │   ├── storageProxy.ts
│   │   ├── heartbeat.ts
│   │   ├── vite.ts
│   │   ├── trpc.ts
│   │   ├── env.ts
│   │   ├── index.ts
│   │   ├── systemRouter.ts
│   │   └── ...
│   ├── routers.ts                   # tRPC 路由
│   ├── db.ts                        # 數據庫查詢
│   ├── storage.ts                   # 文件存儲
│   ├── auth.logout.test.ts          # 測試文件
│   ├── contact.deleteMultiple.test.ts
│   └── contact.submit.test.ts
│
├── drizzle/                         # 數據庫
│   ├── schema.ts                    # 數據庫 schema
│   ├── relations.ts                 # 表關係
│   ├── migrations/                  # 遷移文件
│   └── meta/
│
├── shared/                          # 共享代碼
│   ├── types.ts
│   ├── const.ts
│   └── _core/
│
├── storage/                         # S3 存儲助手
│   └── index.ts
│
├── references/                      # 參考文檔
│   └── periodic-updates.md
│
├── drizzle.config.ts                # Drizzle 配置
├── vite.config.ts                   # Vite 配置
├── vitest.config.ts                 # Vitest 配置
├── tsconfig.json                    # TypeScript 配置
├── package.json                     # 依賴配置
├── pnpm-lock.yaml                   # 依賴鎖定
├── .prettierrc                       # Prettier 配置
├── .prettierignore
├── .gitignore
├── README.md                        # 項目文檔
└── todo.md                          # 待辦清單
```

## 技術棧

| 層級 | 技術 | 版本 |
|------|------|------|
| **前端框架** | React | 19 |
| **前端語言** | TypeScript | 5.9.3 |
| **樣式框架** | Tailwind CSS | 4 |
| **UI 組件庫** | shadcn/ui | 最新 |
| **路由** | Wouter | 最新 |
| **後端框架** | Express | 4 |
| **API 層** | tRPC | 11.6.0 |
| **數據庫 ORM** | Drizzle | 0.44.5 |
| **數據庫** | MySQL/TiDB | - |
| **構建工具** | Vite | 7 |
| **測試框架** | Vitest | 最新 |
| **包管理器** | pnpm | 最新 |

## 主要功能

### 前端功能
- ✅ 響應式網站設計
- ✅ 首頁展示（Hero、Features、Services、Process、About）
- ✅ 聯繫表單提交
- ✅ 常見 Q&A（手風琴式）
- ✅ 後台管理頁面
- ✅ 表單提交記錄查看
- ✅ 批量刪除功能
- ✅ OAuth 認證
- ✅ 響應式導航
- ✅ SEO 優化（Schema.org、Open Graph、Twitter Card）

### 後端功能
- ✅ 表單提交 API
- ✅ 自動郵件發送（公司通知 + 用戶回覆）
- ✅ 表單記錄查詢
- ✅ 批量刪除
- ✅ 用戶認證
- ✅ 密碼驗證
- ✅ 數據庫操作

### 數據庫
- ✅ contactSubmissions 表（表單提交記錄）
- ✅ users 表（用戶信息）

## 文件類型統計

| 類型 | 數量 |
|------|------|
| TypeScript (.ts/.tsx) | ~200+ |
| CSS (.css) | ~50+ |
| JSON (.json) | ~100+ |
| 圖片 (webp/png/jpg) | ~50+ |
| 其他配置文件 | ~100+ |

## 恢復步驟

### 1. 解壓備份
```bash
tar -xzf bravo-career-center-backup-20260616-103926.tar.gz
cd bravo-career-center
```

### 2. 安裝依賴
```bash
pnpm install
```

### 3. 配置環境變量
編輯 `.env` 文件，設置以下必要的環境變量：
```
DATABASE_URL=mysql://user:password@host:port/database
JWT_SECRET=your-secret-key
VITE_APP_ID=your-app-id
OAUTH_SERVER_URL=your-oauth-url
VITE_OAUTH_PORTAL_URL=your-portal-url
OWNER_OPEN_ID=your-owner-id
OWNER_NAME=your-name
COMPANY_EMAIL=company@example.com
BUILT_IN_FORGE_API_URL=api-url
BUILT_IN_FORGE_API_KEY=api-key
VITE_FRONTEND_FORGE_API_KEY=frontend-key
VITE_FRONTEND_FORGE_API_URL=frontend-api-url
VITE_ANALYTICS_ENDPOINT=analytics-endpoint
VITE_ANALYTICS_WEBSITE_ID=website-id
VITE_APP_TITLE=Bravo Career Center
VITE_APP_LOGO=logo-url
```

### 4. 初始化數據庫
```bash
pnpm db:push
```

### 5. 開發模式
```bash
pnpm dev
```

### 6. 生產構建
```bash
pnpm build
```

### 7. 運行測試
```bash
pnpm test
```

## 重要文件

- **README.md** - 完整的項目文檔和開發指南
- **todo.md** - 項目待辦清單和功能進度
- **drizzle.config.ts** - 數據庫配置
- **vite.config.ts** - 前端構建配置
- **vitest.config.ts** - 測試配置

## 部署信息

- **域名**: www.bravocareercenter.com, bravocareercenter.com
- **自動域名**: bravocareers-kmsn4imp.manus.space
- **部署方式**: Manus 自動部署
- **SSL**: 自動配置

## 聯繫方式

- **公司**: 築夢人生涯諮詢服務有限公司
- **網站**: https://www.bravocareercenter.com
- **地址**: 北市就服 NO.283・專業人才服務公司

## 最後更新

- **日期**: 2026-06-16
- **版本**: 0ede3e20
- **功能**: 常見 Q&A 功能完成

---

**備份說明**: 此備份包含項目的所有源代碼、配置文件和文檔。恢復後需要配置環境變量和數據庫連接才能正常運行。
