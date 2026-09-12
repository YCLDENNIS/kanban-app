---
description: Development standards, coding conventions, architectural guidelines, and Git workflow for the Kanban App.
globs: ["**/*.js", "**/*.html", "**/*.css"]
---

# Development Standards & Guidelines

本規範定義 **Kanban App** 專案的技術架構準則、前端編程規範、安全防護要求與 Git 版本控制工作流程。

---

## 1. 專案架構定位與核心原則 (Core Principles)

* **零建置相依 (Zero Build / Pure Vanilla)**：
  * 本專案為純靜態前端架構，**嚴禁**引入需要編譯打包（如 Webpack、Vite、Babel）的工具鏈或 Node.js 後端依賴。
  * 確保任何人在無安裝套件的環境下，直接以瀏覽器開啟 `index.html` 或透過簡易靜態伺服器即可直接運行。
* **嚴格關注點分離 (Separation of Concerns)**：
  * **結構 (`index.html`)**：僅放置語意化標籤與骨架，嚴禁撰寫行內樣式 (`style="..."`) 或行內事件監聽 (`onclick="..."`)。
  * **樣式 (`style.css`)**：集中管理全站佈局、視覺主題、過渡動態與響應式斷點。
  * **邏輯 (`app.js`)**：專注於狀態管理、事件監聽、DOM 操作與瀏覽器 LocalStorage 同步。

---

## 2. JavaScript 規範 (JavaScript Guidelines)

* **語言標準**：
  * 一律採用現代 ES6+ 原生語法（`const`/`let`、箭頭函式、解構賦值、樣板字面值），**禁止使用 `var`**。
* **狀態管理與資料流**：
  * **單一資料來源 (Single Source of Truth)**：所有看板資料以記憶體中的 `tasks` 陣列為唯一依據，禁止從 DOM 元素的文字中反查或維護狀態。
  * **同步持久化**：任何引起資料變更的操作（新增、編輯、拖曳移位、刪除、清空），必須呼叫 `saveTasks()` 即時存入 `localStorage`，隨後呼叫 `renderBoard()` 重新渲染畫面。
* **XSS 安全防護**：
  * 在動態拼接 HTML（如卡片標題、備註）前，**必須**使用 `escapeHTML()` 函式轉義跳脫，杜絕惡意腳本注入攻擊：
    ```javascript
    function escapeHTML(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }
    ```
* **HTML5 原生拖曳規範 (Drag and Drop)**：
  * 卡片拖曳開始 (`dragstart`) 必須設定 `e.dataTransfer.setData('text/plain', taskId)`。
  * 拖曳結束 (`dragend`) 必須確實清除所有欄位的視覺樣式（如 `.drag-over` 與 `.dragging`），避免樣式殘留。

---

## 3. CSS 與視覺設計規範 (CSS Guidelines)

* **變數優先設計 (Design Tokens)**：
  * 所有全域配色、卡片背景、文字色彩、邊框與圓角一律取用 `:root` 中定義的 CSS 變數（例如 `var(--bg-card)`, `var(--color-primary)`），嚴禁在各選擇器中隨意寫死 Hex 色碼。
* **響應式佈局 (Responsive Design)**：
  * 採用 CSS Grid 與 Flexbox 進行佈局。
  * 桌機端預設為三欄並列 (`grid-template-columns: repeat(3, minmax(320px, 1fr))`)；在螢幕寬度小於 900px 時自動切換為單欄直向排列。
* **互動反饋**：
  * 所有按鈕、可拖曳卡片及互動元件，必須具備平滑的 `:hover`、`:active` 或 `:focus` 狀態過渡（建議使用 `transition: all 0.15s ease`）。

---

## 4. HTML 標籤與無障礙規範 (HTML & Accessibility)

* **語意化結構**：
  * 頁首使用 `<header>`、主要看板區域使用 `<main>`、欄位使用 `<section>`、表單彈窗使用明確的標籤結構。
* **表單與無障礙性 (a11y)**：
  * 所有輸入控制項（`input`, `textarea`, `select`）必須具有唯一的 `id` 並與對應的 `<label for="...">` 綁定。
  * 支援鍵盤無障礙操作，例如按下 `Esc` 鍵應關閉目前開啟的表單彈窗。

---

## 5. Git 版本控制與上線流程 (Git & Deployment Workflow)

* **非自動提交原則**：
  * 本專案不啟用任何存檔自動提交機制。所有 Commit 必須在本地確認功能無誤後手動或指示 AI 進行。
* **Conventional Commits 規範**：
  * Commit 訊息必須採用業界標準前綴：
    * `feat:` 新增看板功能（如：標籤篩選、匯出 JSON、暗黑/明亮主題切換）
    * `fix:` 修復問題（如：修正手機版拖曳失效、修復彈窗未重設輸入框）
    * `style:` 純樣式調整（如：微調卡片陰影、欄位間距）
    * `refactor:` 程式碼重構（不影響外部行為的邏輯整理）
    * `docs:` 文件相關更新（如：README.md、Rules 規範異動）
* **GitHub Pages 部署維護**：
  * 推送前須確認本機運作正常，因為推送到 `main` 分支將觸發 GitHub Actions 自動更新公開線上站台（[https://ycldennis.github.io/kanban-app/](https://ycldennis.github.io/kanban-app/)）。
