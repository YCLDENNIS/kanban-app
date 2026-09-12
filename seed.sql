-- 寫入示範資料
PRAGMA foreign_keys = ON;

-- 插入會員
INSERT INTO users (name, email, phone) VALUES 
('Peace Maker', 'peacemaker@projectbutterfly.dc', '+1-555-019-7322'),
('Adrian Chase (Vigilante)', 'vigilante@dc.justice', '+1-555-018-8833'),
('Emilia Harcourt', 'harcourt@argus.gov', '+1-555-017-4411');

-- 插入商品
INSERT INTO products (product_name, price, description, stock) VALUES 
('超聲波脈衝鍍鉻頭盔 (Sonic Boom Helmet)', 4999.00, '發射高頻聲波脈衝，可擊碎周遭障礙物。', 5),
('極限格鬥戰術手槍 (Desert Eagle Custom)', 1850.00, '配備消音管與和平鴿雕花刻印。', 12),
('老鷹 Eagly 頂級鮭魚點心包 (Eagle Treats)', 120.00, '頂級野生鮭魚切片，鷹類最愛。', 100),
('80年代華麗重金屬經典卡帶組 (Hair Metal Cassettes)', 85.00, '包含 Wig Wam、Faster Pussycat 等經典樂團。', 50);

-- 插入購買紀錄 (user_product)
INSERT INTO user_products (user_id, product_id, quantity, purchase_price) VALUES 
(1, 1, 1, 4999.00), -- Peace Maker 買了 1 頂超聲波頭盔
(1, 3, 5, 120.00),   -- Peace Maker 買了 5 包 Eagly 鮭魚點心
(1, 4, 2, 85.00),    -- Peace Maker 買了 2 組重金屬卡帶
(2, 2, 1, 1850.00),  -- Adrian Chase 買了 1 把戰術手槍
(3, 4, 1, 85.00);    -- Emilia Harcourt 買了 1 組重金屬卡帶
