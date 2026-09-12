import bcrypt
import jwt
from datetime import datetime, timedelta, timezone
from typing import List, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from backend.database import get_db

# JWT 設定
JWT_SECRET_KEY = "cms-secret-key-for-development-antigravity-secure-jwt"
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 7

# RBAC 角色定義
class Roles:
    SUPER_ADMIN = "super_admin"
    EDITOR = "editor"
    AUTHOR = "author"
    PROOFREADER = "proofreader"
    ALL_ROLES = [SUPER_ADMIN, EDITOR, AUTHOR, PROOFREADER]

security = HTTPBearer()

def hash_password(password: str) -> str:
    """使用 Bcrypt 加鹽雜湊密碼"""
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """驗證密碼是否匹配"""
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception:
        return False

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """簽發 Access Token (預設 15 分鐘)"""
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    expire = now + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire, "iat": now, "type": "access"})
    return jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)

def create_refresh_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """簽發 Refresh Token (預設 7 天)"""
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    expire = now + (expires_delta or timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS))
    to_encode.update({"exp": expire, "iat": now, "type": "refresh"})
    return jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)

def decode_token(token: str, expected_type: str = "access") -> dict:
    """解碼與校驗 Token"""
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != expected_type:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"無效的 Token 類型 (預期為 {expected_type})"
            )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token 已逾期，請重新換發或登入"
        )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="無效的認證 Token"
        )

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """FastAPI 相依項：解析當前登入者資訊"""
    token = credentials.credentials
    payload = decode_token(token, expected_type="access")
    user_id = payload.get("sub")
    
    with get_db() as conn:
        cursor = conn.execute("SELECT id, name, email, role, created_at FROM users WHERE id = ?", (user_id,))
        user = cursor.fetchone()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="使用者不存在或已被移除"
            )
        return dict(user)

def require_roles(allowed_roles: List[str]):
    """RBAC 角色權限守衛相依項工廠"""
    def role_checker(current_user: dict = Depends(get_current_user)):
        user_role = current_user.get("role")
        if user_role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"權限不足：此操作需要 [{', '.join(allowed_roles)}] 角色，您的角色為 [{user_role}]"
            )
        return current_user
    return role_checker

def check_ownership(resource_owner_id: str, current_user: dict) -> bool:
    """資源所有權檢查：超級管理員與編輯可存取所有資源，作者僅能存取本人資源"""
    if current_user["role"] in [Roles.SUPER_ADMIN, Roles.EDITOR]:
        return True
    return current_user["id"] == resource_owner_id
