# 2026-08-19 變更紀錄

## 變更摘要

本次更新包含預約生涯諮詢頁面視覺改版、去背 Bravo Career Center Logo 統一替換，以及後台登入密碼改為由伺服器端安全環境變數讀取。密碼值不記錄於此文件、程式碼、測試名稱或交付說明中。

## 變更檔案

| 檔案 | 目的 |
| --- | --- |
| `client/src/pages/ConsultationPage.tsx` | 依參考圖調整預約頁面標題、服務卡片、詳細說明與費用資訊卡片版面。 |
| `client/src/components/Navbar.tsx` | 將網站品牌小圖替換為裁切後的去背 Logo。 |
| `client/src/components/Footer.tsx` | 將 Footer 品牌小圖替換為裁切後的去背 Logo。 |
| `client/src/components/sections/ContactSection.tsx` | 將首頁預約入口導向新版 `/consultation` 頁面。 |
| `client/index.html` | 更新 favicon 與相關品牌小圖設定。 |
| `shared/consultation.ts` | 集中管理諮詢服務內容、Logo URL 與預約連結。 |
| `server/routers.ts` | 後台密碼驗證改為只讀取伺服器端 `ADMIN_PASSWORD` 環境變數。 |
| `server/consultation.test.ts` | 驗證服務選項、外部預約連結、Logo 資產 URL 與諮詢資訊欄位。 |
| `server/admin.password.test.ts` | 驗證後台驗證端點使用安全環境變數，未在程式碼中硬編碼密碼。 |
| `todo.md` | 留存需求、視覺驗證、回歸檢查與交付狀態。 |

## 驗證紀錄

- 後台密碼環境變數測試：通過（1 個測試檔、1 個測試）。
- 完整 Vitest：通過（5 個測試檔、17 個測試）。
- 預約頁面：已驗證服務卡片切換、Logo 載入、外部預約連結與 SEO 標籤。
- 後台登入：已以瀏覽器驗證成功導向 `/submissions`。
- 開發環境：已完成健康狀態檢查。
- 開發日誌：已將曾出現的明文密碼替換為 `[REDACTED]`。
- 建置：已執行；若出現大型 chunk 警告，屬效能提示而非編譯錯誤，後續可再做 code-splitting 優化。

## 安全備註

`ADMIN_PASSWORD` 由平台 Secret 管理並注入伺服器環境；前端不讀取、不傳送環境變數。`.project-config.json` 未納入版本控制，並由平台設定管理。交付訊息不包含密碼值。
