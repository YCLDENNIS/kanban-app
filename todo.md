# 內容管理系統 (CMS) 實作待辦清單 (todo.md)

- **依據規格**：[spec.md](file:///Users/ycl/code/practice%202/spec.md)
- **設計架構**：採兩層式（Phase > 模組具體任務），由底層基礎依序推進至高階進階功能。
- **解耦原則**：各階段均具備獨立資料介面與 Mock 邊界，各 Phase 可獨立開發與單元/整合測試。

---

## Phase 1: 基礎資料層與 RBAC 權限體系 (Foundation & Auth)
> **階段目標**：完成底層資料庫綱要遷移、JWT 驗證及 4 級角色權限中介軟體（Middleware），提供後續所有模組的身份認證與授權基石。  
> **解耦測試**：無需前端或文章業務，透過 Postman / REST Client 針對 Auth API 與 RBAC 守衛進行獨立單元測試。

### 1.1 資料庫基礎設施與綱要遷移 (DB Migration)
- [x] **1.1.1** 初始化關聯式資料庫連線池（PostgreSQL / SQLite）並配置連線健康檢查。
- [x] **1.1.2** 建立 `users` 資料表，包含 `id (UUID)`, `email (UK)`, `password_hash`, `role (enum)`。
- [x] **1.1.3** 撰寫初始種子資料腳本（Seed Script），建立「超級管理員」、「編輯」、「作者」與「校對」4 組預設測試帳號。

### 1.2 身份驗證與 Token 管理 (Authentication)
- [x] **1.2.1** 實作密碼雜湊模組（Argon2id 或 Bcrypt，加鹽迭代次數符合安全規範）。
- [x] **1.2.2** 實作 `POST /api/v1/auth/login` 端點，簽發 Access Token (15 分鐘) 與 Refresh Token (7 天)。
- [x] **1.2.3** 實作 `POST /api/v1/auth/refresh` 換發 Token 與 `POST /api/v1/auth/logout` 吊銷機制。

### 1.3 RBAC 角色權限中介層 (Authorization Guard)
- [x] **1.3.1** 建立 RBAC 角色常數定義（`SuperAdmin`, `Editor`, `Author`, `Proofreader`）。
- [x] **1.3.2** 實作路由級別權限守衛（Role Guard / Middleware），校驗 JWT Payload 內之角色權限。
- [x] **1.3.3** 實作資源擁有權檢查器（Ownership Checker），供「作者僅能存取本人資源」之邏輯調用。

> **🧪 Phase 1 獨立驗收標準**：
> 1. 執行種子腳本可成功建立 4 類角色帳號。
> 2. 以 Author 身份攜帶 Token 存取僅限 Editor 之測試端點，正確回傳 `403 Forbidden`。
> 3. Token 逾期能正常透過 Refresh Token 自動續期。

---

## Phase 2: 分類標籤與媒體資產庫 (Taxonomy & Media Assets)
> **階段目標**：建立兩層級分類樹、標籤雲彙整，以及具備自動壓縮轉 WebP 與線上裁切之集中式媒體中心。  
> **解耦測試**：不依賴文章模組，可獨立上傳測試圖片、建立目錄樹、驗證圖片轉檔規格與無障礙 Alt Text 保存。

### 2.1 雙層級分類與標籤系統 (Taxonomy Management)
- [ ] **2.1.1** 建立 `categories` 表（支援 `parent_id` 自參照外鍵），限制階層深度最多為 2 層（主分類 > 子分類）。
- [ ] **2.1.2** 實作分類 CRUD API（`GET/POST/PUT/DELETE /api/v1/categories`），內建防呆阻斷：含子分類之主分類禁止直接刪除。
- [ ] **2.1.3** 建立 `tags` 資料表與熱門度計數欄位 `article_count`，實作標籤即時模糊查重與新增 API。

### 2.2 媒體庫目錄樹與檔案上傳 (Media Gallery & Upload)
- [ ] **2.2.1** 建立 `media_folders` 與 `media_assets` 資料表，支援階層資料夾結構。
- [ ] **2.2.2** 串接雲端物件儲存（S3 / R2 / MinIO），封裝安全上傳與 Presigned URL 生成服務。
- [ ] **2.2.3** 實作 `POST /api/v1/media/upload` 支援單檔與多檔 `multipart/form-data` 上傳。

### 2.3 影像自動轉檔與線上編輯管線 (Image Processing Pipeline)
- [ ] **2.3.1** 整合 Sharp 影像處理核心，實作檔案 Magic Byte 二進位驗證，阻斷惡意偽造副檔名。
- [ ] **2.3.2** 實作圖片上傳自動處理管線：超過 2048px 自動等比例縮放、強制轉為 WebP 格式 (品質 85%)，並產出 300x200 縮圖。
- [ ] **2.3.3** 實作線上圖片編輯 API（`PATCH /api/v1/media/:id`），支援傳入參數執行比例裁切、旋轉 90°/180° 與保存 `alt_text`。

> **🧪 Phase 2 獨立驗收標準**：
> 1. 建立第 3 層分類時，後端驗證阻斷並回傳 `400 Bad Request`。
> 2. 上傳 10MB 的 JPG 原圖，系統成功產出小於 1MB 的 WebP 檔案與縮圖，二進位格式符合規範。
> 3. 更新圖片 `alt_text` 後，重新查詢該媒體資產能正確反映修改。

---

## Phase 3: 文章管理模組與複合檢索 (Article Management)
> **階段目標**：完成文章列表頁面、狀態分流快照、多維度複合交集查詢、批量操作工具列、即時 SEO 健康度運算及自定義列顯示。  
> **解耦測試**：使用 Mock 或直接插入的資料庫文章紀錄，獨立驗證表格篩選效能、分頁狀態、批量軟刪除及 SEO 評分邏輯。

### 3.1 狀態分流與複合查詢引擎 (Status Views & Query Engine)
- [ ] **3.1.1** 建立 `articles` 主表與複合索引（包含 `status`, `author_id`, `category_id`, `created_at`）。
- [ ] **3.1.2** 實作 `GET /api/v1/articles`，支援狀態分流（All / Draft / Pending / Published / Scheduled / Trashed）與各狀態即時數量計數。
- [ ] **3.1.3** 實作多維度複合篩選：標題關鍵字（ILIKE）、作者、雙層分類、標籤及日期區間（建立/發佈日期）。
- [ ] **3.1.4** 前端整合 TanStack Table，完成分頁（Pagination）、排序（Sorting）及 URL Query String 狀態雙向綁定。

### 3.2 批量操作與安全防護 (Batch Operations)
- [ ] **3.2.1** 實作列表表頭全選 Checkbox 與跨頁選擇狀態管理，勾選觸發浮動操作工具列。
- [ ] **3.2.2** 實作 `POST /api/v1/articles/batch` 批次發佈、批次修改分類與批次移至垃圾桶。
- [ ] **3.2.3** 批量操作封裝於資料庫 ACID Transaction 中，確保原子性，並回傳部分失敗明細。

### 3.3 SEO 指標快照與欄位自定義 (SEO Snapshot & Custom Columns)
- [ ] **3.3.1** 開發 SEO 評分運算函式（100分制）：綜合檢驗標題字數、Meta Description、Slug 格式、內文字數及圖片 Alt Text。
- [ ] **3.3.2** 列表中顯示閱讀數 (PV)、點擊率 (CTR) 及紅/黃/綠 SEO 分數徽章，Hover 展開扣分診斷明細。
- [ ] **3.3.3** 實作「自定義欄位」下拉面板，勾選即時顯示/隱藏指定欄位，並將排版偏好寫入 `localStorage`。

> **🧪 Phase 3 獨立驗收標準**：
> 1. 百萬級文章測試資料庫下，複合篩選與狀態計數能在 200ms 內完成回應。
> 2. 多選 5 篇文章批次移至垃圾桶，5 篇狀態即時轉為 `trashed`，並自公開列表移除。
> 3. 取消勾選「封面縮圖」列並重整瀏覽器，該列維持隱藏不跑版。

---

## Phase 4: 區塊式創作編輯器與自動保存 (Block-based Editor)
> **階段目標**：打造結構化區塊編輯介面、2.5 秒輸入防抖靜默自動存檔、歷史修訂版本回滾、SEO 側邊欄與社群 OpenGraph 預覽。  
> **解耦測試**：以獨立編輯器頁面進行單元測試，模擬打字中斷、斷網容災快取、樂觀鎖衝突及歷史版本 Diff 還原。

### 4.1 區塊式編輯核心構建 (Block-based Core)
- [ ] **4.1.1** 整合 Tiptap / Editor.js 編輯器核心，定義標準結構化 JSON 輸出格式（`content_blocks`）。
- [ ] **4.1.2** 實作多格式區塊組件：標題 (H1-H4)、富文本段落、清單、引言、程式碼高亮區塊。
- [ ] **4.1.3** 實作多媒體與外部嵌入區塊：圖片插入、拖拽重排、YouTube 影片與社群貼文 Embed 解析。
- [ ] **4.1.4** 實作 Markdown 快捷語法即時轉換（如 `# ` 轉 H1、`- ` 轉清單）。

### 4.2 靜默自動儲存與衝突控制 (Autosave & Concurrency)
- [ ] **4.2.1** 前端實作 2.5 秒輸入防抖（Debounce）計時器，觸發 `PATCH /api/v1/articles/:id/autosave` 靜默更新。
- [ ] **4.2.2** 實作前端 `IndexedDB` 本地備份快照（每 1 秒），提供瀏覽器崩潰或斷網時的本機容災還原提示。
- [ ] **4.2.3** 實作樂觀並行鎖（Optimistic Concurrency Control）：攜帶 `last_updated_at`，偵測多人並行衝突時拋出 `409 Conflict` 並彈出 Diff 視窗。

### 4.3 修訂版本歷史與回滾 (Revision History)
- [ ] **4.3.1** 建立 `article_revisions` 表，每編輯 5 分鐘或手動保存時產生修訂版本快照。
- [ ] **4.3.2** 實作版本歷史抽屜面板，列表展示版本時間戳、修改人與字數增減。
- [ ] **4.3.3** 實作版本差異對比視覺化（Diff Viewer），並提供一鍵回滾還原至指定歷史版本 API。

### 4.4 SEO 側邊欄與社群卡片即時預覽 (SEO Panel & OG Preview)
- [ ] **4.4.1** 實作自定義 URL Slug 欄位，標題輸入時自動轉拼音/英文字串，並提供防重覆驗證。
- [ ] **4.4.2** 實作 Meta Title (30-60字) 與 Meta Description (120-160字) 輸入框，附帶即時字數顏色警示條。
- [ ] **4.4.3** 實作 Open Graph 預覽組件，即時渲染模擬「Facebook 貼文卡片」與「Line/X 聊天分享卡片」。

> **🧪 Phase 4 獨立驗收標準**：
> 1. 停止輸入 2.5 秒後，右上方準確跳出「已於 XX:XX 自動儲存」，重整頁面內容完整保留。
> 2. 斷開網路連線輸入文字後重整，系統偵測並成功從 IndexedDB 還原遺失內容。
> 3. 點擊任一歷史版本之「還原」，編輯區內容精準倒回該時間點之結構與文字。

---

## Phase 5: 排程引擎、AI 輔助與多端同步 (Automation & Distribution)
> **階段目標**：串接定時排程引擎（Redis Delay Queue）、LLM AI 協作端點，以及跨平台 Webhook（Telegram/Slack）與 Web3（IPFS/Arweave）廣播。  
> **解耦測試**：可透過測試 Mock 文章獨立觸發發佈任務、模擬社群 Webhook 接收端點，以及單獨驗證 LLM Prompt 回傳結構。

### 5.1 定時發佈排程系統 (Scheduled Publishing Engine)
- [ ] **5.1.1** 整合 Redis 與 BullMQ 分佈式佇列，建立延遲發佈任務隊列（Delay Queue）。
- [ ] **5.1.2** 實作設定預約排程發佈端點，將文章狀態置為 `scheduled` 並寫入 `scheduled_at`。
- [ ] **5.1.3** 實作定時發佈 Worker：每分鐘輪詢觸發，將到期文章原子更新為 `published`，並記錄 `published_at`。
- [ ] **5.1.4** 實作排程重啟補償機制（Catch-up Query），排程服務重啟時自動補發停機期間逾期的排程文章。

### 5.2 LLM AI 協作引擎整合 (AI Assistant Pipeline)
- [ ] **5.2.1** 封裝 Google Gemini API / OpenAI API 客戶端連線層，設置超時與錯誤重試機制。
- [ ] **5.2.2** 實作 `POST /api/v1/ai/assist` (Task: `generate_title`)：輸入內文回傳 3~5 組吸睛與 SEO 候選標題。
- [ ] **5.2.3** 實作 `POST /api/v1/ai/assist` (Task: `generate_summary`)：自動提煉內文輸出 150 字內精準摘要。
- [ ] **5.2.4** 實作 `POST /api/v1/ai/assist` (Task: `extract_tags`)：自動分析文章主題並提取 5 個關鍵字標籤。

### 5.3 多端社群與 Web3 同步發佈 (Multi-channel & Web3 Broadcast)
- [ ] **5.3.1** 建立 `publish_tasks` 資料表，記錄各目標平台之發佈狀態與回傳 Payload。
- [ ] **5.3.2** 實作 Telegram Bot 推播 Worker：文章公開發佈時，向指定 Channel 發送帶封面圖、標題與導流連結之訊息。
- [ ] **5.3.3** 實作 Slack Webhook Worker：推送帶有 Block Kit 格式化卡片至內部 Slack 頻道。
- [ ] **5.3.4** 實作 Web3 鏈上存儲 Worker：封裝 Pinata (IPFS) / Irys (Arweave)，上傳 Markdown/JSON 快照並保存回傳之 CID / Transaction Hash。
- [ ] **5.3.5** 實作推播重試機制（3 次指數退避）與死信隊列（DLQ），任一外鏈推送失敗不阻斷文章本體發佈。

> **🧪 Phase 5 獨立驗收標準**：
> 1. 設定 1 分鐘後排程發佈，時間到達時狀態自動變更為 `published`。
> 2. 點擊「AI 標題推薦」，3 秒內成功取得結構化標題清單且可替換。
> 3. 發佈文章勾選 Telegram/Slack，外端測試頻道成功接收到圖文卡片，且 Web3 欄位成功寫入 IPFS CID。

---

## Phase 6: 安全防禦、非功能性需求與全站驗收 (Hardening & E2E)
> **階段目標**：實施 XSS 白名單過濾、檔案二進位安全審查、快取效能調優，並依據 spec.md 執行完整 E2E 驗收測試。  
> **解耦測試**：安全性滲透測試腳本、壓力測試工具（k6 / Locust）及 Playwright 全自動端對端測試。

### 6.1 安全性強化與防禦 (Security Hardening)
- [ ] **6.1.1** 實作 `DOMPurify` 渲染消毒中介層，徹底清除文章區塊內夾帶的惡意 `<script>`、`onload` 及非法偽協議。
- [ ] **6.1.2** 完善檔案上傳防護：副檔名白名單、Magic Byte 檢查、隨機 UUID 檔名重命名，徹底銷毀 EXIF 隱匿代碼。
- [ ] **6.1.3** 實作全站 API 限流保護（Rate Limiting）：針對登入、AI 請求與檔案上傳設定 IP 頻率閾值。

### 6.2 效能優化與邊緣快取 (Performance & Caching)
- [ ] **6.2.1** 針對公開發佈文章啟用 Edge CDN 快取機制（Cache-Control: s-maxage=3600）。
- [ ] **6.2.2** 實作隨選快取失效（On-Demand Cache Invalidation）：文章更新或下架時，自動發送 Webhook 清除 CDN 快取。
- [ ] **6.2.3** 執行資料庫慢查詢審查（EXPLAIN ANALYZE），優化百萬級資料量下文章列表與複合索引效能。

### 6.3 驗收測試與端對端覆蓋 (End-to-End Testing)
- [ ] **6.3.1** 撰寫 Playwright E2E 自動化測試：覆蓋「作者撰稿 -> 提交審核 -> 編輯審批 -> 排程發佈 -> 前台顯示」之完整生命週期。
- [ ] **6.3.2** 逐項核對 [spec.md](file:///Users/ycl/code/practice%202/spec.md) 第 7 章之驗收指標（AC-101 至 AC-304），產出測試覆蓋確認報告。

> **🧪 Phase 6 獨立驗收標準**：
> 1. 輸入包含 `<script>alert(1)</script>` 之區塊內容，前台渲染完全消毒，未執行惡意代碼。
> 2. 於 k6 壓測下，列表查詢 95% 響應時間維持於 150ms 以內，自動存檔維持於 100ms 以內。
> 3. Playwright 自動化測試全數通過（Green Passed）。
