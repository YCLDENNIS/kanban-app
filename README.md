# 📋 Kanban Flow | 互動式任務看板

一個輕量、現代且流暢的純前端任務看板應用。無須安裝任何建置工具或外部套件，開箱即用，支援原生 HTML5 拖曳排序（Drag & Drop）與瀏覽器本地持久化儲存（LocalStorage）。

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-success?style=flat-square&logo=github)](https://ycldennis.github.io/kanban-app/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Vanilla JS](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JS-orange?style=flat-square)](https://developer.mozilla.org/)

---

## 🌐 線上展示 (Live Demo)

* **GitHub Pages 線上預覽**：  
  👉 [https://ycldennis.github.io/kanban-app/](https://ycldennis.github.io/kanban-app/)
* **GitHub 專案原始碼**：  
  👉 [https://github.com/YCLDENNIS/kanban-app](https://github.com/YCLDENNIS/kanban-app)

> [!TIP]
> 點擊上方線上展示連結即可直接操作，所有建立的卡片均會即時保存在您的瀏覽器中，重新整理或重啟瀏覽器都不會丟失！

---

## ✨ 核心特色與功能清單

| 模組 | 功能細節 | 技術實作 |
| :--- | :--- | :--- |
| **三欄進度流** | 清楚劃分「待處理 (To Do)」、「進行中 (In Progress)」、「已完成 (Done)」 | 語意化 HTML5 + CSS Grid 響應式佈局 |
| **拖曳排序** | 支援跨欄位自由拖曳放置卡片，具備懸停指示與即時狀態變更 | 原生 HTML5 Drag and Drop API |
| **卡片增修刪** | 支援任務名稱、備註說明、三段優先級（高/中/低）標籤設定 | 彈窗表單 (Modal) + 動態 DOM 渲染 |
| **本地持久化** | 任何卡片的新增、編輯、拖曳移動或刪除，皆自動同步至瀏覽器 | Browser `localStorage` API |
| **批次清理** | 提供「清除已完成」按鈕，快速歸檔已處理完成的任務卡片 | JavaScript 陣列過濾與確認視窗防誤觸 |
| **深色現代 UI** | 採用 Slate 暗色系主題、微漸層與毛玻璃模糊視窗，適配行動裝置 | CSS 自定義變數 (Variables) + 媒體查詢 |

---

## 📁 專案目錄結構

```text
kanban-app/
├── index.html                  # 應用主要骨架與語意化標籤
├── style.css                   # 現代暗色主題、排版與拖曳動態特效
├── app.js                      # 核心邏輯：狀態管理、拖曳事件與 LocalStorage
├── README.md                   # 專案完整說明文件
├── .gitignore                  # Git 忽略設定
└── .agents/
    └── rules/
        └── docs-writing.md     # 專案技術文件撰寫規範
```

---

## 🚀 快速開始 (Quick Start)

本專案為零依賴的純靜態前端架構，可透過以下任一方式在本地運行：

### 方式 A：直接在瀏覽器開啟
直接雙擊專案目錄下的 `index.html` 檔案，即可在預設瀏覽器中開啟並開始使用。

### 方式 B：使用 Python 本地伺服器（推薦）
在終端機中切換至專案根目錄，並執行：

```bash
# 啟動 Python 3 靜態伺服器 (連接埠 8000)
python3 -m http.server 8000
```

終端機預期輸出：
```text
Serving HTTP on :: port 8000 (http://[::]:8000/) ...
```

開啟瀏覽器前往 [http://localhost:8000](http://localhost:8000) 即可使用。

---

## 💡 使用者操作指引 (User Guide)

### 1. 新增卡片
* 點擊頁首右側的「**新增任務**」按鈕，或各欄位底部的「**＋ 新增卡片**」。
* 輸入任務標題（必填）、備註細節，並選擇預設欄位與優先程度（🔴 高 / 🟡 中 / 🟢 低）。
* 點擊「儲存任務」或按下鍵盤 `Enter` 即可送出。

### 2. 拖曳變更進度
* 滑鼠按住任一張卡片開始拖曳，目標欄位會出現虛線高亮邊框。
* 將卡片放置於目標欄位中，放開滑鼠即自動完成狀態更新。

### 3. 編輯與刪除卡片
* 將滑鼠懸停於卡片上方，右上角會顯示「✎ (編輯)」與「✕ (刪除)」操作按鈕。
* 點擊「✎」可重新修改任務內容；點擊「✕」並經確認後將永久移除該卡片。

### 4. 快捷鍵支援
* 在開啟任務彈窗時，按下 `Esc` 鍵可快速關閉彈窗。

---

## ⚙️ 資料設計 (Data Model)

所有看板資料皆以 JSON 格式儲存於瀏覽器的 `localStorage`（鍵名：`kanban_app_tasks`）：

```javascript
[
  {
    "id": "task-1726105800000-a1b2",
    "title": "完成產品需求審查",
    "desc": "確認功能規格與里程碑交付時程",
    "status": "todo",           // "todo" | "in-progress" | "done"
    "priority": "high",         // "high" | "medium" | "low"
    "createdAt": 1726105800000
  }
]
```

> [!NOTE]
> 若使用者為首次造訪且本地尚無儲存紀錄，系統會自動載入 4 張預設示範卡片，方便立即體驗各項功能。

---

## 📜 開發規範

專案文件的維護與新增請遵循本專案的 Rules：
* 詳細指引請參考 [`.agents/rules/docs-writing.md`](.agents/rules/docs-writing.md)。

---

## 📄 授權條款 (License)

本專案採用 [MIT License](LICENSE) 授權開放。
