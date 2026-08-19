# 預約頁面預覽檢查

日期：2026-08-19

已開啟 `/consultation` 預覽。標題、兩張服務卡片、服務內容、費用資訊、付款連結與 Footer 均已出現在頁面，Footer 的「預約生涯諮詢」已導向 `/consultation`。

目前需修正：截圖中預約頁面標題旁與兩張服務卡片中的去背 Logo 呈現為接近空白的白色方塊，需確認圖片 URL、圖片格式與透明背景是否正確載入；不可直接假設 Logo 已正常顯示。

測試與建置：Vitest 4 個測試檔、15 個測試均通過；`pnpm build` 成功，僅有既有的 bundle size warning；開發伺服器 running，TypeScript 與 LSP 無錯誤。

Logo 診斷：原始 WebP 尺寸為 2048×1448，但非透明內容範圍僅約為 (729,266)–(1320,1165)，導致小尺寸 object-contain 只顯示成接近空白的方塊。已裁切為 591×899 的透明 WebP，並上傳至 `/manus-storage/bravo-logo-icon_d5e91661.webp`；共用資料已改用新 URL。

Logo 修正後重新執行 Vitest：4 個測試檔、15 個測試全部通過。

再次預覽：新裁切後 Logo 已可辨識地呈現在預約頁標題與兩張服務卡片中，不再是空白方塊；卡片選取狀態、標題、內容與按鈕均正常顯示。

## 2026-08-19 最新驗證
- ConsultationPage 已呈現標題、說明、兩張服務卡、完整職涯說明與諮詢資訊區塊。
- 服務卡可互動切換：初始職涯諮詢為藍框選取，點擊築夢諮詢後選取樣式互換，再點擊職涯諮詢可恢復。
- 頁面共 4 張 Logo 圖片均載入完成，來源為 `/manus-storage/bravo-logo-icon_d5e91661.webp`，自然尺寸為 591×899。
- Navbar、兩張服務卡與 Footer 均使用同一個裁切後去背 Logo。
- 首頁 ContactSection 的「預約生涯諮詢」入口已改為 `/consultation`，不再直接跳至外部表單。
- `pnpm test`：5 個測試檔、16 個測試全部通過。
- `pnpm build`：Vite 與 server bundle 均成功；僅有既有 chunk size 警告。
- 尚待以不同瀏覽器視窗寬度進行額外人工檢查；目前已完成桌機預覽與互動狀態驗證。

## SEO 與斷點回歸
- 預約頁面 canonical 與 `og:url` 均指向 `https://www.bravocareercenter.com`。
- favicon 已指向裁切後去背 Logo `/manus-storage/bravo-logo-icon_d5e91661.webp`。
- 預約頁面目前桌機視窗為 1280×1100，匹配 desktop 斷點；未載入額外 JSON-LD，與目前全站 SPA 設計一致。
- 服務卡互動與圖片載入檢查已在前一段驗證完成。

## 後台登入驗證
- `/admin` 登入頁可正常載入密碼欄位與登入按鈕。
- 使用已設定的新密碼送出後，成功導向 `/submissions` 聯絡表單提交管理頁，確認前端與後端密碼驗證串接有效。
- 後台頁面顯示目前共有 0 條提交記錄；本次驗證未新增或修改任何資料。

## 2026-08-19 最新 DOM 回歸檢查
目前開發預覽頁面 `/consultation` 已呈現卡片式預約介面。DOM 檢查結果顯示兩張服務卡片分別為「職涯諮詢」與「築夢諮詢」，第一張預設 `aria-pressed=true`、第二張為 `false`；付款連結為 `https://forms.gle/YTYE3Lu5bnJncteGA`。頁面內 4 個 Logo 圖片均載入同一個 `/manus-storage/bravo-logo-icon_d5e91661.webp` 去背資產，原生寬度為 591；桌面 viewport 寬度為 1280px，頁面無水平溢位。
