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
