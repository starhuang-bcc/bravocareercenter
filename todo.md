# Bravo Career Center - 項目待辦清單

## 已完成的功能
- [x] 建立基礎網站結構和首頁
- [x] 實現聯絡表單前端 UI
- [x] 建立資料庫 schema（contactSubmissions 表）
- [x] 實現表單提交後端路由 (contact.submit)
- [x] 自動寄送表單至公司信箱
- [x] 自動回覆表單提交者
- [x] 建立簡單的後台查看頁面 (/submissions)
- [x] 新增 contact.list 路由用於查詢提交記錄
- [x] 設定 BRAVO logo 作為 favicon
- [x] 隱私權政策文字設定為「我已閱讀並同意」

## 待完成的功能
- [x] 測試 /submissions 頁面是否能正確載入和顯示資料
- [x] 驗證表單提交流程是否完全正常
- [x] 在首頁底部添加「後台管理」鏈接
- [x] 創建密碼保護的登錄頁面
- [x] 設定登錄密碼為 admin6688
- [x] 將「後台管理」鏈接移到 Footer 右下角
- [x] 將密碼驗證移至後端
- [x] 在後台頁面添加標籤篩選表單（求才企業、合作詢問、等）
- [x] 添加勾選删除功能
- [x] 調整 Footer 位置，將「後台管理」鏈接放在右下角
- [x] 最优化页面 UI/UX 设计
- [x] 新增状态管理功能（可选）

## 已知問題
- 無

## 備註
- 所有表單提交記錄已成功保存到資料庫
- 目前資料庫中有 11 條測試記錄
- 所有單元測試通過 (7 tests passed)

## 最近更新
- [x] 更新首頁圖片：「人才外包服務」旁邊換上企業管理系統圖，「我們的歷史」旁邊換成男性輔導圖
- [x] 生成新的「人才外包」服務圖片，所有人物為華人男女面孔
- [x] 更新 ServicesSection.tsx 中的人才外包圖片 URL
- [x] 配置自訂域名 DNS（A 記錄 + CNAME）
- [x] 等待 DNS 全球傳播
- [x] 修復「人才外包」圖片文字切割問題
  - 重新生成圖片，文字大小減少 70%
  - 增加左側邊距 15%
  - 確保所有文字不會被容器切割
  - 已部署到生產環境（兩個域名都已生效）


## SEO 優化 - Schema.org 結構化數據
- [ ] 創建 Schema 組件和工具函數
- [ ] 添加 Organization Schema（公司信息）
- [ ] 添加 LocalBusiness Schema（本地商業信息）
- [ ] 添加 Service Schema（服務信息）
- [ ] 添加 BreadcrumbList Schema（導航路徑）
- [ ] 驗證 Schema 標記使用 Google 結構化數據測試工具
- [ ] 在 Google Search Console 中檢查結構化數據報告

## Schema.org 結構化數據實現完成
- [x] 創建 Schema 工具函數和組件
  - client/src/lib/schema.ts：包含所有 Schema 生成函數
  - client/src/components/SchemaScript.tsx：React 組件用於注入 JSON-LD
- [x] 在首頁添加 Organization 和 LocalBusiness Schema
  - 在 Home.tsx 中使用 SchemaScript 組件
- [x] 在服務頁面添加 Service Schema
  - 在 ServicesSection.tsx 中添加三個服務的 Schema
- [x] 添加 BreadcrumbList Schema
  - 創建 BreadcrumbSchema 組件
  - 在 App.tsx 中自動注入麵包屑導航 Schema
- [x] 所有現有測試通過（7 tests passed）

## 下一步建議
- 使用 Google 結構化數據測試工具驗證 Schema 標記
- 在 Google Search Console 中檢查結構化數據報告
- 監控搜尋結果中的 Rich Snippets 顯示情況


## 社群媒體優化 - Open Graph 和 Twitter Card
- [ ] 創建 Meta 標籤工具函數
- [ ] 在 HTML 中添加基礎 OG 和 Twitter Card 標籤
- [ ] 創建動態 Meta 標籤 React 組件
- [ ] 在首頁應用 Meta 標籤
- [ ] 在服務頁面應用 Meta 標籤
- [ ] 使用社群媒體分享預覽工具驗證


## Open Graph 和 Twitter Card 實現完成
- [x] 創建 Meta 標籤工具函數
  - client/src/lib/meta.ts：包含所有 Meta 標籤生成函數
  - generateOpenGraphMeta()、generateTwitterCardMeta()、generateStandardMeta()
- [x] 在 HTML 中添加基礎 OG 和 Twitter Card 標籤
  - client/index.html：添加所有必要的 Meta 標籤
- [x] 創建動態 Meta 標籤 React 組件
  - client/src/components/MetaTags.tsx：React 組件用於動態設置標籤
- [x] 在首頁應用 Meta 標籤
  - Home.tsx：使用 MetaTags 組件
- [x] 驗證 Meta 標籤
  - 所有 Meta 標籤已正確注入到 HTML 中
  - 所有現有測試通過（7 tests passed）


## 職缺列表更新
- [x] 更新常見招募職缺文字為新的 9 個職位
  - 軟韌體開發RD
  - 硬體研發RD
  - 類比/數位IC設計RD
  - 軟硬體測試RD（替代「封裝 RD」）
  - 資料工程/分析師
  - CV/ML/DL/RL RD（替代「測試品保 RD」）
  - 製程/製程整合RD
  - Business Development Manager
  - Product / Project Manager
  - 已部署到生產環境
- [x] 為職缺列表添加科技感小圖示
  - Code 圖示用於軟韌體開發RD
  - Cpu 圖示用於硬體研發RD
  - Zap 圖示用於類比/數位IC設計RD
  - TestTube 圖示用於軟硬體測試RD
  - Database 圖示用於資料工程/分析師
  - Brain 圖示用於CV/ML/DL/RL RD
  - Wrench 圖示用於製程/製程整合RD
  - TrendingUp 圖示用於Business Development Manager
  - Briefcase 圖示用於Product / Project Manager
  - 所有測試通過（7 tests passed）
  - 已部署到生產環境


## SEO 優化 - 重複網頁修復
- [x] 添加 Canonical 標籤指向 www.bravocareercenter.com
- [x] 配置 301 永久重定向（非 www → www）
- [x] 更新 Sitemap 中所有 URL 為 www 版本
- [x] 更新 Open Graph og:url 為 www 版本
- [x] 添加 hreflang 標籤指向 www 版本
- [ ] 在 Google Search Console 中設置首選域名為 www.bravocareercenter.com
- [ ] 在 Google Search Console 中提交更新的 Sitemap
- [ ] 等待 Google 重新抓取和索引（24-48 小時）


## 後台管理功能增強 - 批量刪除
- [x] 實現後端批量刪除接口 (contact.deleteMultiple)
- [x] 在前端添加全選複選框
- [x] 實現批量選擇邏輯
- [x] 添加批量刪除按鈕（選中時顯示）
- [x] 添加確認對話框防止誤刪
- [x] 改進 UI/UX - 添加選中計數和狀態提示
- [x] 添加單元測試
- [x] 驗證功能並保存檢查點

實現細節：
- 在表頭添加全選複選框，可一鍵選中所有記錄
- 顯示已選擇的記錄數量 (已選擇 X / Y 條)
- 當選中記錄時，顯示紅色批量刪除按鈕
- 刪除前顯示確認對話框
- 所有測試通過 (12 tests passed)
- 支援在搜尋或篩選時自動清空選中狀態
