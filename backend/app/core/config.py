from pydantic_settings import BaseSettings
from typing import Optional
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # App
    APP_NAME: str = "SnackTrack API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]
    
    # JWT Authentication
    JWT_SECRET_KEY: str = "your-super-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Redis (ElastiCache in production)
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_PASSWORD: Optional[str] = None
    REDIS_DB: int = 0
    
    # Rate Limiting
    RATE_LIMIT_AUTH_PER_MIN: int = 150  # Authenticated users
    RATE_LIMIT_UNAUTH_PER_MIN: int = 50  # Unauthenticated (per IP)
    RATE_LIMIT_THIRD_PARTY_AUTH_PER_MIN: int = 60  # Third-party API calls (auth)
    RATE_LIMIT_THIRD_PARTY_UNAUTH_PER_MIN: int = 15  # Third-party API calls (unauth)
    RATE_LIMIT_SENSITIVE_PER_MIN: int = 5  # Login, signup, password reset
    
    # Third-party APIs
    SPOONACULAR_API_KEY: Optional[str] = None
    GOOGLE_GEOCODING_API_KEY: Optional[str] = None
    
    # AWS (for production)
    AWS_REGION: str = "us-east-1"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
