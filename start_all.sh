#!/usr/bin/env bash
# ==========================================================
# 一鍵啟動方案 A：Python (FastAPI) 後端 + React (Vite) 前端
# ==========================================================

cleanup() {
    echo ""
    echo "🛑 正在停止所有服務..."
    kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

echo "=========================================================="
echo "🚀 正在啟動 方案 A (Python FastAPI + React + SQLite)"
echo "=========================================================="

# 確保種子帳號已建立
python3 -m backend.seed

# 啟動 Python FastAPI 後端
python3 -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
echo "✓ 後端 API 服務已啟動: http://127.0.0.1:8000 (PID: $BACKEND_PID)"
echo "  - Swagger 互動文件: http://127.0.0.1:8000/docs"

# 啟動 React 前端
npm run dev &
FRONTEND_PID=$!
echo "✓ 前端 Web 介面已啟動: http://localhost:5173 (PID: $FRONTEND_PID)"
echo "=========================================================="
echo "💡 服務運行中，隨時按 Ctrl+C 可一併終止服務。"
echo "=========================================================="

wait $BACKEND_PID $FRONTEND_PID
