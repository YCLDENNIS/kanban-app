import unittest
from fastapi.testclient import TestClient
from backend.main import app
from backend.seed import seed_users
from backend.auth import hash_password, verify_password

class TestPhase1AuthAndRBAC(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # 確保種子帳號已建立
        seed_users()
        cls.client = TestClient(app)

    def test_01_password_hashing(self):
        """測試 1.2.1: 密碼雜湊與校驗模組"""
        raw = "MySecretPassword123"
        hashed = hash_password(raw)
        self.assertNotEqual(raw, hashed)
        self.assertTrue(verify_password(raw, hashed))
        self.assertFalse(verify_password("WrongPassword", hashed))

    def test_02_login_success_and_tokens(self):
        """測試 1.2.2: 登入成功並簽發 Access Token 與 Refresh Token"""
        res = self.client.post("/api/v1/auth/login", json={
            "email": "author@cms.dev",
            "password": "Password123!"
        })
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("access_token", data)
        self.assertIn("refresh_token", data)
        self.assertEqual(data["user"]["role"], "author")
        self.assertEqual(data["user"]["email"], "author@cms.dev")

    def test_03_login_failure_wrong_password(self):
        """測試 1.2.2: 密碼錯誤回傳 401"""
        res = self.client.post("/api/v1/auth/login", json={
            "email": "author@cms.dev",
            "password": "WrongPassword!"
        })
        self.assertEqual(res.status_code, 401)

    def test_04_refresh_token_rotation(self):
        """測試 1.2.3: 換發 Access Token"""
        login_res = self.client.post("/api/v1/auth/login", json={
            "email": "author@cms.dev",
            "password": "Password123!"
        })
        refresh_token = login_res.json()["refresh_token"]

        res = self.client.post("/api/v1/auth/refresh", json={
            "refresh_token": refresh_token
        })
        self.assertEqual(res.status_code, 200)
        self.assertIn("access_token", res.json())

    def test_05_public_and_unauthorized_endpoints(self):
        """測試公開端點與未授權攔截"""
        # 公開端點無需 Token
        res_pub = self.client.get("/api/v1/test/public")
        self.assertEqual(res_pub.status_code, 200)

        # 受保護端點無 Token 回傳 401/403
        res_prot = self.client.get("/api/v1/test/authenticated")
        self.assertIn(res_prot.status_code, [401, 403])

    def test_06_rbac_author_permissions(self):
        """測試 1.3.2: RBAC 權限守衛 - Author 存取範圍與 403 攔截"""
        login_res = self.client.post("/api/v1/auth/login", json={
            "email": "author@cms.dev",
            "password": "Password123!"
        })
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # 1. Author 存取 Author 權限路由 -> 200 OK
        res1 = self.client.get("/api/v1/test/author-access", headers=headers)
        self.assertEqual(res1.status_code, 200)

        # 2. Author 嘗試越權存取 Editor 權限路由 -> 403 Forbidden
        res2 = self.client.get("/api/v1/test/editor-access", headers=headers)
        self.assertEqual(res2.status_code, 403)
        self.assertIn("權限不足", res2.json()["detail"])

        # 3. Author 嘗試越權存取 SuperAdmin 權限路由 -> 403 Forbidden
        res3 = self.client.get("/api/v1/test/admin-access", headers=headers)
        self.assertEqual(res3.status_code, 403)

    def test_07_rbac_editor_permissions(self):
        """測試 1.3.2: RBAC 權限守衛 - Editor 存取權限"""
        login_res = self.client.post("/api/v1/auth/login", json={
            "email": "editor@cms.dev",
            "password": "Password123!"
        })
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Editor 可以存取 Author 與 Editor 路由
        self.assertEqual(self.client.get("/api/v1/test/author-access", headers=headers).status_code, 200)
        self.assertEqual(self.client.get("/api/v1/test/editor-access", headers=headers).status_code, 200)
        # 但不能存取 SuperAdmin 專屬路由
        self.assertEqual(self.client.get("/api/v1/test/admin-access", headers=headers).status_code, 403)

    def test_08_rbac_super_admin_permissions(self):
        """測試 1.3.2: RBAC 權限守衛 - Super Admin 擁有全功能權限"""
        login_res = self.client.post("/api/v1/auth/login", json={
            "email": "admin@cms.dev",
            "password": "Password123!"
        })
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        self.assertEqual(self.client.get("/api/v1/test/author-access", headers=headers).status_code, 200)
        self.assertEqual(self.client.get("/api/v1/test/editor-access", headers=headers).status_code, 200)
        self.assertEqual(self.client.get("/api/v1/test/admin-access", headers=headers).status_code, 200)

    def test_09_resource_ownership(self):
        """測試 1.3.3: 資源所有權檢查 (Ownership Checker)"""
        author_res = self.client.post("/api/v1/auth/login", json={
            "email": "author@cms.dev",
            "password": "Password123!"
        })
        author_id = author_res.json()["user"]["id"]
        author_token = author_res.json()["access_token"]

        # Author 存取自己的資源 -> 200 OK
        res_own = self.client.get(
            f"/api/v1/test/ownership/{author_id}",
            headers={"Authorization": f"Bearer {author_token}"}
        )
        self.assertEqual(res_own.status_code, 200)

        # Author 嘗試存取其他作者的資源 -> 403 Forbidden
        other_author_id = "99999999-9999-9999-9999-999999999999"
        res_other = self.client.get(
            f"/api/v1/test/ownership/{other_author_id}",
            headers={"Authorization": f"Bearer {author_token}"}
        )
        self.assertEqual(res_other.status_code, 403)

        # Editor 可以跨越存取任何作者的資源 -> 200 OK
        editor_res = self.client.post("/api/v1/auth/login", json={
            "email": "editor@cms.dev",
            "password": "Password123!"
        })
        editor_token = editor_res.json()["access_token"]
        res_editor_override = self.client.get(
            f"/api/v1/test/ownership/{other_author_id}",
            headers={"Authorization": f"Bearer {editor_token}"}
        )
        self.assertEqual(res_editor_override.status_code, 200)

if __name__ == "__main__":
    unittest.main()
