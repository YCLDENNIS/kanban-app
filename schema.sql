-- 啟用外鍵約束支援 (SQLite 預設不開啟外鍵檢查)
PRAGMA foreign_keys = ON;

-- =======================================================
-- 1. 會員資料表 (users)
-- =======================================================
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,           -- 會員唯一識別碼
    name TEXT NOT NULL,                             -- 會員姓名
    email TEXT NOT NULL UNIQUE,                     -- 電子信箱 (唯一約束，防重複註冊)
    phone TEXT,                                     -- 聯絡電話
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- 註冊時間
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP   -- 最後更新時間
);

-- =======================================================
-- 2. 商品資料表 (products)
-- =======================================================
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,           -- 商品唯一識別碼
    product_name TEXT NOT NULL,                     -- 商品名稱
    price REAL NOT NULL CHECK (price >= 0),         -- 商品單價 (防負數)
    description TEXT,                               -- 商品描述
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0), -- 庫存數量
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- 建立時間
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP   -- 最後更新時間
);

-- =======================================================
-- 3. 會員購買紀錄關聯表 (user_products)
-- =======================================================
CREATE TABLE IF NOT EXISTS user_products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,           -- 購買記錄識別碼
    user_id INTEGER NOT NULL,                       -- 購買人 (參照 users.id)
    product_id INTEGER NOT NULL,                    -- 購買商品 (參照 products.id)
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0), -- 購買數量 (至少 1 件)
    purchase_price REAL NOT NULL CHECK (purchase_price >= 0), -- 成交當下的單價 (保留歷史交易價格)
    purchased_at DATETIME DEFAULT CURRENT_TIMESTAMP,-- 購買成交時間
    
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE RESTRICT
);

-- =======================================================
-- 索引設計 (強化多表查詢與報表效能)
-- =======================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_products_user ON user_products(user_id);
CREATE INDEX IF NOT EXISTS idx_user_products_product ON user_products(product_id);
