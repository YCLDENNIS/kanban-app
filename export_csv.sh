#!/usr/bin/env bash
# 一鍵將 members.db 中的所有資料表匯出為 CSV 檔案
DB_FILE="members.db"

if [ ! -f "$DB_FILE" ]; then
  echo "錯誤：找不到資料庫檔案 $DB_FILE"
  exit 1
fi

echo "開始從 $DB_FILE 匯出資料表至 CSV..."

# 取得所有非系統資料表名稱
TABLES=$(sqlite3 "$DB_FILE" "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';")

for table in $TABLES; do
  OUTPUT_FILE="${table}.csv"
  sqlite3 -header -csv "$DB_FILE" "SELECT * FROM ${table};" > "$OUTPUT_FILE"
  echo "✓ 已匯出: $OUTPUT_FILE"
done

# 同步建立單數命名版本（以利不同命名習慣之工具或程式調用）
cp -f users.csv user.csv 2>/dev/null && echo "✓ 已同步建立單數檔案: user.csv"
cp -f products.csv product.csv 2>/dev/null && echo "✓ 已同步建立單數檔案: product.csv"
cp -f user_products.csv user_product.csv 2>/dev/null && echo "✓ 已同步建立單數檔案: user_product.csv"

echo "匯出完成！"
