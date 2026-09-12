import uuid
from backend.database import init_db, get_db
from backend.auth import hash_password, Roles

DEFAULT_USERS = [
    {
        "id": "11111111-1111-4111-8111-111111111111",
        "name": "超級管理員 (Super Admin)",
        "email": "admin@cms.dev",
        "password": "Password123!",
        "role": Roles.SUPER_ADMIN
    },
    {
        "id": "22222222-2222-4222-8222-222222222222",
        "name": "內容主編 (Chief Editor)",
        "email": "editor@cms.dev",
        "password": "Password123!",
        "role": Roles.EDITOR
    },
    {
        "id": "33333333-3333-4333-8333-333333333333",
        "name": "特約作者 (Peace Maker)",
        "email": "author@cms.dev",
        "password": "Password123!",
        "role": Roles.AUTHOR
    },
    {
        "id": "44444444-4444-4444-8444-444444444444",
        "name": "內容校對 (Proofreader)",
        "email": "proofreader@cms.dev",
        "password": "Password123!",
        "role": Roles.PROOFREADER
    }
]

def seed_users():
    """初始化並寫入 4 類角色預設測試帳號"""
    init_db()
    with get_db() as conn:
        for u in DEFAULT_USERS:
            # 檢查是否已存在
            exists = conn.execute("SELECT id FROM users WHERE email = ?", (u["email"],)).fetchone()
            pwd_hash = hash_password(u["password"])
            if exists:
                conn.execute(
                    "UPDATE users SET name = ?, password_hash = ?, role = ? WHERE email = ?",
                    (u["name"], pwd_hash, u["role"], u["email"])
                )
            else:
                conn.execute(
                    "INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)",
                    (u["id"], u["name"], u["email"], pwd_hash, u["role"])
                )
    print("✓ 資料庫初始化與 4 類角色種子帳號建立完成！")

if __name__ == "__main__":
    seed_users()
