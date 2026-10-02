# BRAVO 企業人才管理平台

入口 `/enterprise/login`。沿用移轉分支的前後台分離架構與 Express API 服務，新增獨立 `/api/enterprise` API 與 HttpOnly session，不使用舊共用管理密碼或 Manus OAuth。

## 部署

現有 Static Site：srv-daokj9bbc2fs73ed8d5g，正式分支 render-v1.0-migration。前台需設定 `VITE_API_BASE_URL` 為既有 API Web Service 的 HTTPS URL，人才平台 fetch 使用此設定並包含 Cookie。Static Site 本身不執行 Express，不能單独提供登入與資料保存。請將本 PR 合併至 render-v1.0-migration，API 與 Static Site 都須部署此版本。

Static Site 的 Build 沿用 `corepack pnpm install --frozen-lockfile && corepack pnpm vite build`，Publish Directory 為 `dist/public`。保留既有 SPA rewrite（/* → /index.html）。API 的設定如下。

- Build：`corepack pnpm install --frozen-lockfile && corepack pnpm build`
- Start：`corepack pnpm start`（不可使用只提供靜態頁面的 `server/index.ts`）
- 沿用既有 MySQL `DATABASE_URL`。首次使用只建立 `bravo_enterprise_state`、`bravo_enterprise_sessions` 兩張新 InnoDB 表，不改既有表。資料庫帳號須有建立新表的權限。
- `ENTERPRISE_ORIGIN` 設為企業平台實際 origin，例如 `https://www.bravocareercenter.com`，不包含結尾斜線。也可用逗號列出兩個官網 origin；API 保留移轉版 CORS_ORIGINS 設定。
- `ENTERPRISE_ADMIN_EMAIL`：管理員 Email。
- `ENTERPRISE_ADMIN_PASSWORD`：部署時安全設定，至少 12 字元。沒有預設帳密。首次登入會建立管理員，之後不會以環境變數覆蓋已建立帳號密碼。建立後可移除 bootstrap 密碼，管理員可在平台變更密碼。
- 保留原本官網所需的其他環境變數及資料庫連線 TLS 設定；不要輸出密碼至日誌。
- 正式環境必須以 HTTPS 服務。session 有效 8 小時，正式環境 cookie 使用 Secure、HttpOnly、SameSite=None，配合同源清單檢查及 credentialed CORS；本機測試使用 Strict。建議 API 使用 api.bravocareercenter.com 同站網域，避免瀏覽器封鎖第三方 Cookie。

## 使用順序

1. 管理員登入，在帳號管理新增廠商。
2. 新增約聘人才與薪資、合約起訖，再建立廠商／人才帳號。
3. 出勤管理選人才與月份，填入排除日期，確認已核對行事曆及留停期間，批次預填 09:00–18:00。週末不預填；調移工作日可人工新增。
4. 修改各日上下班、假別、請假與加班時數。休息時間必須核對，不把 09:00–18:00 自動認定為 9 小時工時。
5. 也可匯入既有範例格式的 .xlsx；只讀取選定人才的當月每日紀錄，忽略表尾假別餘額。重複日期會阻擋，不自動覆蓋。
6. 依合約確認請款公式及核對假勤額度／資格，儲存後請人才登入，以手寫簽名確認出勤版本。
7. 管理員發布月結，廠商才能查看該人才的月表與未稅費用。

## 招募需求

廠商可填職稱、人數、正職／約聘、JD 文字、備註，附加 PDF／Word（最多 5 MB）。BRAVO 管理員更新招募狀態。附件透過同一權限篩選 API 傳遞，沒有公開下載 URL。請使用可信任的 JD 文件；本版未提供防毒掃描。

## 計費與假勤

基本費用＝月薪＋12% 保險費＋10% 管理費，皆為合約計費項目，不代表實際法定保費。未稅；本版不新增稅額。

日薪＝月薪／30；時薪＝月薪／240。事假、家庭照顧假按時薪扣款；普通病假與生理假先以半薪試算，發布前須管理員核對年度額度與適用條件。全薪病假及其他有薪假不扣薪，但須核對資格及額度。

平日加班依每日 4/3、5/3 分段；休息日依 4/3、5/3、8/3 分段。超出一般範圍、國定假日／例假出勤、產假、安胎、公傷及留停等，必須人工核定金額並填依據。本版不是全自動法規判斷或假別額度引擎，不會將未設定情形默認扣薪。

廠商請款調整是否保持保險費／管理費按原月薪計算，使用者尚未明確確認，所以預設「待合約確認」。管理員確認採此規則後，才可選擇「按原月薪另加減出勤調整」並發布。試算保留精度，總額末端四捨五入到小數兩位。

## 資料與限制

- MySQL 保存平台狀態，交易以 FOR UPDATE 序列化，防止併發更新遺失。適合目前小規模管理；大量人才／JD 應將 JSON 狀態拆分成關聯資料表與私有附件儲存。
- 修改月表保留歷史出勤列與簽名版本，取消當前簽名及發布狀態。操作紀錄保留最近 2000 筆，歷史月表版本不自動清除。
- 每日打卡以伺服器臺北時間為準，同日已有後台紀錄會阻擋打卡覆蓋。跨日／補登由 BRAVO 核對後人工處理。打卡本身不自動認定加班。
- 本版為官網打卡，尚未串接 LINE Login／LIFF、GPS、通知及 PDF 匯出。
- 沒有匯入真實人才、月薪或廠商資料。新資料庫表不包含示範資料。
- 上線前仍須在 BRAVO 正式 MySQL 驗證帳號建立、登入、資料保存、附件及簽名流程，並依既有備份制度保存新表。
