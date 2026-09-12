#!/usr/bin/env python3
"""
Python 客戶端獨立測試前端 (Python Client Frontend)
用於驗證 Phase 1: SQLite 資料層、JWT 雙 Token 簽發與 4 級 RBAC 權限攔截。
"""

import sys
import json
import urllib.request
import urllib.error

BASE_URL = "http://127.0.0.1:8000"

def log_header(title):
    print("\n" + "=" * 65)
    print(f"🚀 {title}")
    print("=" * 65)

def http_request(method, path, body=None, token=None):
    url = f"{BASE_URL}{path}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    data = json.dumps(body).encode("utf-8") if body else None
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(req) as response:
            res_code = response.getcode()
            res_data = json.loads(response.read().decode("utf-8"))
            return res_code, res_data
    except urllib.error.HTTPError as e:
        error_body = json.loads(e.read().decode("utf-8")) if e.fp else {}
        return e.code, error_body
    except Exception as e:
        return None, {"error": str(e)}

def run_suite():
    log_header("Phase 1: Python 前端客戶端整合驗證")

    # 1. 測試公開端點
    print("\n[測試 1] 存取公開端點...")
    code, res = http_request("GET", "/api/v1/test/public")
    print(f"  -> HTTP {code}: {res.get('message')}")
    assert code == 200, "公開端點應回傳 200"

    # 2. 測試 Author 登入
    print("\n[測試 2] 模擬 Author (Peace Maker) 登入...")
    code, res = http_request("POST", "/api/v1/auth/login", {
        "email": "author@cms.dev",
        "password": "Password123!"
    })
    print(f"  -> HTTP {code}: 取得 Access Token: {res.get('access_token', '')[:25]}...")
    assert code == 200, "Author 登入應成功"
    author_token = res["access_token"]
    author_id = res["user"]["id"]

    # 3. 測試 Author 存取 Author 權限路由
    print("\n[測試 3] Author 存取 Author 專屬端點 (/api/v1/test/author-access)...")
    code, res = http_request("GET", "/api/v1/test/author-access", token=author_token)
    print(f"  -> HTTP {code}: {res.get('message')}")
    assert code == 200, "Author 應可存取 Author 路由"

    # 4. 測試 Author 越權存取 Editor 權限路由 (預期 403)
    print("\n[測試 4] Author 嘗試越權存取 Editor 專屬端點 (/api/v1/test/editor-access)...")
    code, res = http_request("GET", "/api/v1/test/editor-access", token=author_token)
    print(f"  -> HTTP {code}: {res.get('detail')}")
    assert code == 403, "Author 存取 Editor 路由必須回傳 403 Forbidden"
    print("  ✓ 403 Forbidden 攔截成功！RBAC 權限守衛運作正常。")

    # 5. 測試 Editor 登入並存取 Editor 路由
    print("\n[測試 5] 模擬 Editor (內容主編) 登入...")
    code, res = http_request("POST", "/api/v1/auth/login", {
        "email": "editor@cms.dev",
        "password": "Password123!"
    })
    editor_token = res["access_token"]
    code, res = http_request("GET", "/api/v1/test/editor-access", token=editor_token)
    print(f"  -> HTTP {code}: {res.get('message')}")
    assert code == 200, "Editor 應可成功存取 Editor 路由"

    # 6. 測試 Super Admin 存取最高管理者端點
    print("\n[測試 6] 模擬 Super Admin 登入並存取最高管理端點...")
    code, res = http_request("POST", "/api/v1/auth/login", {
        "email": "admin@cms.dev",
        "password": "Password123!"
    })
    admin_token = res["access_token"]
    code, res = http_request("GET", "/api/v1/test/admin-access", token=admin_token)
    print(f"  -> HTTP {code}: {res.get('message')}")
    assert code == 200, "SuperAdmin 應可存取 Admin 路由"

    # 7. 測試資源擁有權 (Ownership) 檢查
    print("\n[測試 7] 資源擁有權檢查測試...")
    # Author 存取自己的資源
    code, res = http_request("GET", f"/api/v1/test/ownership/{author_id}", token=author_token)
    print(f"  -> Author 存取自己資源 HTTP {code}: {res.get('message')}")
    assert code == 200

    # Author 存取其他人的資源 (預期 403)
    fake_id = "00000000-0000-0000-0000-000000000000"
    code, res = http_request("GET", f"/api/v1/test/ownership/{fake_id}", token=author_token)
    print(f"  -> Author 存取他人資源 HTTP {code}: {res.get('detail')}")
    assert code == 403

    # Editor 存取任何作者的資源
    code, res = http_request("GET", f"/api/v1/test/ownership/{author_id}", token=editor_token)
    print(f"  -> Editor 存取任何作者資源 HTTP {code}: {res.get('message')}")
    assert code == 200

    log_header("🎉 Phase 1 所有功能與 RBAC 測試驗證全數通過 (All Passed)！")

if __name__ == "__main__":
    run_suite()
