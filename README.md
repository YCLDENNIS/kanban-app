# 📋 Kanban App (互動式任務看板)

一個簡潔、現代且支援拖曳 (Drag & Drop) 的互動式任務看板，純原生前端（HTML5 / CSS3 / Vanilla JavaScript）打造，無須安裝任何套件即可在瀏覽器直接運行。

🔗 **線上展示 (GitHub Pages)**:  
👉 [https://ycldennis.github.io/kanban-app/](https://ycldennis.github.io/kanban-app/)

---

## ✨ 核心特色

- 🎯 **三欄看板進度分流**：支援「待處理 (To Do)」、「進行中 (In Progress)」、「已完成 (Done)」。
- 🖐️ **原生 HTML5 拖曳**：流暢的跨欄卡片拖曳與放置反饋。
- 💾 **瀏覽器本地儲存 (LocalStorage)**：重新整理或重啟瀏覽器，資料完整保留。
- ⚡ **卡片管理**：
  - 支援設定優先程度（🔴 高 / 🟡 中 / 🟢 低標籤）
  - 卡片即時編輯與刪除確認
  - 支援一鍵「清除已完成任務」
- 📱 **響應式現代設計**：適配桌機與行動裝置螢幕，暗色沉浸式介面。

---

## 🚀 專案結構

```
kanban-app/
├── index.html     # 看板骨架與語意化結構
├── style.css      # 現代感暗色系樣式與拖曳動態
├── app.js         # 拖曳邏輯、LocalStorage 存取與卡片狀態控制
├── README.md      # 專案說明與公開展示連結
└── .gitignore     # Git 忽略檔案設定
```

---

## 🛠️ 本地運行

直接在瀏覽器中開啟 `index.html`，或使用任何靜態伺服器（例如 VS Code Live Server 或 Python）：

```bash
# 使用 Python 內建伺服器預覽
python3 -m http.server 8000
```
然後開啟瀏覽器前往 `http://localhost:8000` 即可！
