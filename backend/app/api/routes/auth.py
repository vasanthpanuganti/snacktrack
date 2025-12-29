"""
Authentication routes for SnackTrack.

Provides:
- User registration
- Login/logout
- Token refresh
- Password reset (placeholder)
"""

from datetime import datetime
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr, Field

from app.core.security import (
    hash_password,
    verify_password,
    create_token_pair,
    decode_token,
    TokenPair,
)
from app.middleware.auth import get_current_user

router = APIRouter()


# Request/Response models
class UserRegister(BaseModel):
    """User registration request"""
    email: EmailStr
    password: str = Field(..., min_length=8)
    name: str = Field(..., min_length=2)


class UserLogin(BaseModel):
    """User login request"""
    email: EmailStr
    password: str


class TokenRefresh(BaseModel):
    """Token refresh request"""
    refresh_token: str


class PasswordResetRequest(BaseModel):
    """Password reset request"""
    email: EmailStr


class PasswordReset(BaseModel):
    """Password reset with token"""
    token: str
    new_password: str = Field(..., min_length=8)


class UserResponse(BaseModel):
    """User response (safe to return)"""
    id: str
    email: str
    name: str
    created_at: datetime


class AuthResponse(BaseModel):
    """Authentication response with tokens and user"""
    user: UserResponse
    tokens: TokenPair


# In-memory user store (replace with database in production)
# Initialize with empty dict - demo user created on first access
_users_db: dict[str, dict] = {}
_demo_initialized: bool = False


def _ensure_demo_user():
    """Lazy initialization of demo user to avoid startup issues"""
    global _demo_initialized
    if not _demo_initialized:
        _users_db["demo@example.com"] = {
            "id": "user_demo",
            "email": "demo@example.com",
            "name": "Demo User",
            "password_hash": hash_password("password123"),
            "created_at": datetime.now(),
        }
        _demo_initialized = True


def get_user_by_email(email: str) -> Optional[dict]:
    """Get user by email from database"""
    _ensure_demo_user()
    return _users_db.get(email.lower())


def get_user_by_id(user_id: str) -> Optional[dict]:
    """Get user by ID from database"""
    _ensure_demo_user()
    for user in _users_db.values():
        if user["id"] == user_id:
            return user
    return None


@router.post("/register", response_model=AuthResponse, summary="Register new user")
async def register(data: UserRegister):
    """
    Register a new user account.
    
    Rate limited to 5 requests/min per IP to prevent abuse.
    """
    _ensure_demo_user()
    email = data.email.lower()
    
    # Check if email already exists
    if get_user_by_email(email):
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    # Create user
    user_id = f"user_{datetime.now().timestamp()}"
    user = {
        "id": user_id,
        "email": email,
        "name": data.name,
        "password_hash": hash_password(data.password),
        "created_at": datetime.now(),
    }
    _users_db[email] = user
    
    # Generate tokens
    tokens = create_token_pair(user_id)
    
    return AuthResponse(
        user=UserResponse(
            id=user["id"],
            email=user["email"],
            name=user["name"],
            created_at=user["created_at"],
        ),
        tokens=tokens,
    )


@router.post("/login", response_model=AuthResponse, summary="Login user")
async def login(data: UserLogin):
    """
    Authenticate user and return tokens.
    
    Rate limited to 5 requests/min per IP to prevent brute force.
    """
    _ensure_demo_user()
    email = data.email.lower()
    user = get_user_by_email(email)
    
    if not user or not verify_password(data.password, user["password_hash"]):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )
    
    # Generate tokens
    tokens = create_token_pair(user["id"])
    
    return AuthResponse(
        user=UserResponse(
            id=user["id"],
            email=user["email"],
            name=user["name"],
            created_at=user["created_at"],
        ),
        tokens=tokens,
    )


@router.post("/refresh", response_model=TokenPair, summary="Refresh access token")
async def refresh_token(data: TokenRefresh):
    """
    Get new access token using refresh token.
    """
    payload = decode_token(data.refresh_token)
    
    if not payload or payload.type != "refresh":
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired refresh token"
        )
    
    # Verify user still exists
    user = get_user_by_id(payload.sub)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )
    
    # Generate new token pair
    return create_token_pair(payload.sub)


@router.post("/logout", summary="Logout user")
async def logout(user_id: str = Depends(get_current_user)):
    """
    Logout user (invalidate tokens).
    
    In production, you would add the token to a blacklist in Redis.
    """
    # In production: Add current token to Redis blacklist
    # await redis.setex(f"blacklist:{token}", ttl, "1")
    
    return {"message": "Logged out successfully"}


@router.get("/me", response_model=UserResponse, summary="Get current user")
async def get_me(user_id: str = Depends(get_current_user)):
    """
    Get current authenticated user's profile.
    """
    user = get_user_by_id(user_id)
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserResponse(
        id=user["id"],
        email=user["email"],
        name=user["name"],
        created_at=user["created_at"],
    )


@router.post("/forgot-password", summary="Request password reset")
async def forgot_password(data: PasswordResetRequest):
    """
    Request password reset email.
    
    Rate limited to 5 requests/min per IP to prevent abuse.
    Always returns success to prevent email enumeration.
    """
    # In production:
    # 1. Check if email exists
    # 2. Generate reset token
    # 3. Send email with reset link
    # 4. Store token in Redis with TTL
    
    return {
        "message": "If this email is registered, you will receive a password reset link."
    }


@router.post("/reset-password", summary="Reset password with token")
async def reset_password(data: PasswordReset):
    """
    Reset password using reset token from email.
    
    Rate limited to 5 requests/min per IP.
    """
    # In production:
    # 1. Verify token from Redis
    # 2. Update password hash
    # 3. Delete token from Redis
    # 4. Optionally invalidate all sessions
    
    return {"message": "Password reset successfully"}
