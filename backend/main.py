from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from backend.database import init_db, get_db
from backend.auth import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
    get_current_user,
    require_roles,
    check_ownership,
    Roles
)

app = FastAPI(
    title="CMS 內容管理系統 API - Phase 1",
    version="1.0.0",
    description="包含 SQLite 資料層、JWT 雙 Token 認證與 4 級 RBAC 角色權限守衛"
)

# 允許跨來源資源共用 (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

# ==========================================
# Pydantic 資料模型
# ==========================================
class LoginRequest(BaseModel):
    email: str
    password: str

class RefreshRequest(BaseModel):
    refresh_token: str

class UserProfile(BaseModel):
    id: str
    name: str
    email: str
    role: str
    created_at: str

class AuthResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserProfile

class RefreshResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

# ==========================================
# 1. 認證模組 API (/api/v1/auth)
# ==========================================
@app.post("/api/v1/auth/login", response_model=AuthResponse, summary="使用者登入簽發雙 Token")
def login(data: LoginRequest):
    with get_db() as conn:
        cursor = conn.execute("SELECT * FROM users WHERE email = ?", (data.email,))
        user = cursor.fetchone()
        
        if not user or not verify_password(data.password, user["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="電子郵件或密碼錯誤"
            )
        
        user_dict = dict(user)
        token_data = {"sub": user_dict["id"], "email": user_dict["email"], "role": user_dict["role"]}
        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token(token_data)
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": {
                "id": user_dict["id"],
                "name": user_dict["name"],
                "email": user_dict["email"],
                "role": user_dict["role"],
                "created_at": str(user_dict["created_at"])
            }
        }

@app.post("/api/v1/auth/refresh", response_model=RefreshResponse, summary="以 Refresh Token 換發 Access Token")
def refresh_token(data: RefreshRequest):
    payload = decode_token(data.refresh_token, expected_type="refresh")
    user_id = payload.get("sub")
    
    with get_db() as conn:
        cursor = conn.execute("SELECT id, email, role FROM users WHERE id = ?", (user_id,))
        user = cursor.fetchone()
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="使用者不存在")
        
        new_access_token = create_access_token({
            "sub": user["id"],
            "email": user["email"],
            "role": user["role"]
        })
        
        return {
            "access_token": new_access_token,
            "token_type": "bearer"
        }

@app.get("/api/v1/auth/me", response_model=UserProfile, summary="取得當前已驗證使用者資料")
def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "id": current_user["id"],
        "name": current_user["name"],
        "email": current_user["email"],
        "role": current_user["role"],
        "created_at": str(current_user["created_at"])
    }

# ==========================================
# 2. RBAC 權限獨立測試端點 (/api/v1/test)
# ==========================================
@app.get("/api/v1/test/public", summary="公開端點 (無需登入)")
def public_endpoint():
    return {"status": "ok", "message": "公開端點：任何人皆可存取"}

@app.get("/api/v1/test/authenticated", summary="任何已登入使用者皆可存取")
def authenticated_endpoint(user: dict = Depends(get_current_user)):
    return {
        "status": "ok",
        "message": f"認證成功！歡迎 {user['name']}（角色：{user['role']}）"
    }

@app.get(
    "/api/v1/test/author-access",
    summary="作者、編輯與超級管理員可存取",
    dependencies=[Depends(require_roles([Roles.AUTHOR, Roles.EDITOR, Roles.SUPER_ADMIN]))]
)
def author_endpoint(user: dict = Depends(get_current_user)):
    return {"status": "ok", "message": f"已授權作者權限！操作者：{user['name']}"}

@app.get(
    "/api/v1/test/editor-access",
    summary="僅限編輯與超級管理員存取 (作者存取將拋出 403)",
    dependencies=[Depends(require_roles([Roles.EDITOR, Roles.SUPER_ADMIN]))]
)
def editor_endpoint(user: dict = Depends(get_current_user)):
    return {"status": "ok", "message": f"已授權編輯審核權限！操作者：{user['name']}"}

@app.get(
    "/api/v1/test/admin-access",
    summary="僅限超級管理員存取 (其他角色皆拋出 403)",
    dependencies=[Depends(require_roles([Roles.SUPER_ADMIN]))]
)
def admin_endpoint(user: dict = Depends(get_current_user)):
    return {"status": "ok", "message": f"已授權最高管理者核心權限！操作者：{user['name']}"}

@app.get("/api/v1/test/ownership/{resource_author_id}", summary="資源所有權檢查範例")
def check_resource_access(resource_author_id: str, current_user: dict = Depends(get_current_user)):
    has_access = check_ownership(resource_author_id, current_user)
    if not has_access:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"權限不足：您不是此資源的作者 (您的ID: {current_user['id']}, 目標作者ID: {resource_author_id})"
        )
    return {
        "status": "ok",
        "message": f"允許存取該資源！(操作者: {current_user['name']}, 角色: {current_user['role']})"
    }
