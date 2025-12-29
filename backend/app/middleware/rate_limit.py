"""
Production-ready rate limiting middleware for FastAPI.

Enforces:
- Auth: 150/min/user
- Unauth: 50/min/IP
- Third-party endpoints: Stricter limits to protect API quotas
- Sensitive endpoints: Very strict to prevent abuse

Uses Redis (ElastiCache) for distributed rate limiting across instances.
Falls back to in-memory limiting for local development.
"""

import time
import logging
from typing import Optional

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

from app.core.config import settings
from app.core.redis import RedisClient, in_memory_limiter
from app.core.security import get_user_id_from_token

logger = logging.getLogger(__name__)


# Path prefixes that trigger third-party APIs (Spoonacular, Geocoding, etc.)
THIRD_PARTY_PATH_PREFIXES = (
    "/api/v1/geocode",
    "/api/v1/recipes/search",
    "/api/v1/recipes/nutrition",
    "/api/v1/nutrition",
    "/api/v1/ingredients/search",
)

# Sensitive endpoints that need extra protection
SENSITIVE_PATHS = (
    "/api/v1/auth/login",
    "/api/v1/auth/signup",
    "/api/v1/auth/register",
    "/api/v1/auth/forgot-password",
    "/api/v1/auth/reset-password",
    "/api/v1/auth/otp",
    "/api/v1/auth/verify",
)

# Paths to exclude from rate limiting
EXCLUDED_PATHS = (
    "/",
    "/health",
    "/docs",
    "/redoc",
    "/openapi.json",
)


def get_client_ip(request: Request) -> str:
    """
    Extract real client IP from request.
    
    In AWS with ALB, the real client IP is in X-Forwarded-For header.
    Format: "client, proxy1, proxy2, ..."
    We want the first (leftmost) IP which is the original client.
    """
    # X-Forwarded-For from ALB
    xff = request.headers.get("x-forwarded-for")
    if xff:
        # Get first IP (original client)
        return xff.split(",")[0].strip()
    
    # X-Real-IP (some proxies)
    xri = request.headers.get("x-real-ip")
    if xri:
        return xri.strip()
    
    # Direct connection
    if request.client:
        return request.client.host
    
    return "unknown"


def get_user_id_from_request(request: Request) -> Optional[str]:
    """
    Extract user_id from JWT in Authorization header.
    
    Expected format: "Bearer <token>"
    Returns None if not authenticated or token is invalid.
    """
    # Check if already extracted by auth dependency
    if hasattr(request.state, "user_id") and request.state.user_id:
        return request.state.user_id
    
    # Extract from Authorization header
    auth_header = request.headers.get("authorization", "")
    if auth_header.startswith("Bearer "):
        token = auth_header[7:]  # Remove "Bearer " prefix
        user_id = get_user_id_from_token(token)
        if user_id:
            # Store for later use
            request.state.user_id = user_id
            return user_id
    
    return None


def get_rate_limit_for_path(path: str, is_authenticated: bool) -> int:
    """Determine the appropriate rate limit based on path and auth status"""
    
    # Sensitive endpoints get strictest limits
    if path.startswith(SENSITIVE_PATHS):
        return settings.RATE_LIMIT_SENSITIVE_PER_MIN
    
    # Third-party API endpoints
    if path.startswith(THIRD_PARTY_PATH_PREFIXES):
        if is_authenticated:
            return settings.RATE_LIMIT_THIRD_PARTY_AUTH_PER_MIN
        else:
            return settings.RATE_LIMIT_THIRD_PARTY_UNAUTH_PER_MIN
    
    # Regular endpoints
    if is_authenticated:
        return settings.RATE_LIMIT_AUTH_PER_MIN
    else:
        return settings.RATE_LIMIT_UNAUTH_PER_MIN


class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Rate limiting middleware using Redis for distributed counting.
    
    Features:
    - Per-user limits for authenticated requests
    - Per-IP limits for unauthenticated requests
    - Stricter limits for third-party API endpoints
    - Very strict limits for sensitive auth endpoints
    - Graceful fallback to in-memory limiting if Redis unavailable
    """
    
    async def dispatch(self, request: Request, call_next):
        path = request.url.path
        method = request.method
        
        # Skip rate limiting for excluded paths
        if path in EXCLUDED_PATHS or path.startswith("/static"):
            return await call_next(request)
        
        # Skip OPTIONS requests (CORS preflight)
        if method == "OPTIONS":
            return await call_next(request)
        
        # Get identity info
        client_ip = get_client_ip(request)
        user_id = get_user_id_from_request(request)
        is_authenticated = user_id is not None
        
        # Determine rate limit
        limit = get_rate_limit_for_path(path, is_authenticated)
        
        # Build rate limit key
        now = int(time.time())
        window = now // 60  # 1-minute buckets
        
        if is_authenticated:
            key = f"rl:user:{user_id}:{window}"
            identity = f"user:{user_id}"
        else:
            key = f"rl:ip:{client_ip}:{window}"
            identity = f"ip:{client_ip}"
        
        # Check rate limit
        is_allowed, current_count = await self._check_rate_limit(key, limit)
        
        if not is_allowed:
            # Calculate retry-after
            retry_after = 60 - (now % 60)
            
            logger.warning(
                f"Rate limit exceeded: {identity} on {path} "
                f"({current_count}/{limit} req/min)"
            )
            
            return JSONResponse(
                status_code=429,
                content={
                    "error": "Too Many Requests",
                    "message": "Rate limit exceeded. Please slow down.",
                    "retry_after": retry_after,
                },
                headers={
                    "Retry-After": str(retry_after),
                    "X-RateLimit-Limit": str(limit),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": str(now + retry_after),
                },
            )
        
        # Process request
        response = await call_next(request)
        
        # Add rate limit headers to response
        remaining = max(0, limit - current_count)
        response.headers["X-RateLimit-Limit"] = str(limit)
        response.headers["X-RateLimit-Remaining"] = str(remaining)
        response.headers["X-RateLimit-Reset"] = str(now + (60 - now % 60))
        
        return response
    
    async def _check_rate_limit(self, key: str, limit: int) -> tuple[bool, int]:
        """
        Check and increment rate limit counter.
        Returns (is_allowed, current_count)
        """
        redis_client = await RedisClient.get_client()
        
        if redis_client:
            try:
                # Atomic increment
                current = await redis_client.incr(key)
                
                # Set expiry on first request in window
                if current == 1:
                    await redis_client.expire(key, 75)  # 75s > 60s for safety
                
                return current <= limit, current
                
            except Exception as e:
                logger.error(f"Redis error in rate limiting: {e}")
                # Fall through to in-memory
        
        # Fallback to in-memory limiting
        return in_memory_limiter.check_and_increment(key, limit)

