"""
Authentication middleware and dependencies for FastAPI.

Extracts and validates JWT tokens, making user_id available to routes.
"""

from typing import Optional
from fastapi import Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.core.security import decode_token, TokenPayload

# HTTP Bearer token security scheme
security = HTTPBearer(auto_error=False)


async def get_current_user_optional(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> Optional[str]:
    """
    Get current user_id if authenticated, None otherwise.
    Does not raise an error for unauthenticated requests.
    """
    if not credentials:
        return None
    
    token = credentials.credentials
    payload = decode_token(token)
    
    if payload and payload.type == "access":
        # Store on request.state for rate limiter
        request.state.user_id = payload.sub
        return payload.sub
    
    return None


async def get_current_user(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> str:
    """
    Get current user_id, raises 401 if not authenticated.
    """
    if not credentials:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = credentials.credentials
    payload = decode_token(token)
    
    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if payload.type != "access":
        raise HTTPException(
            status_code=401,
            detail="Invalid token type",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Store on request.state for rate limiter
    request.state.user_id = payload.sub
    return payload.sub


class AuthMiddleware:
    """
    Middleware to pre-extract user_id from JWT for rate limiting.
    
    This runs before route handlers, making user_id available
    to the rate limiter without requiring auth on every endpoint.
    """
    
    async def __call__(self, request: Request, call_next):
        # Try to extract user_id from token
        auth_header = request.headers.get("authorization", "")
        
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
            payload = decode_token(token)
            if payload and payload.type == "access":
                request.state.user_id = payload.sub
        
        return await call_next(request)

