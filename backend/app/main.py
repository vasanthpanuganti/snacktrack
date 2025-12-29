"""
SnackTrack API - Main Application Entry Point

A personalized, affordable, and health-aware diet planning platform.
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.redis import RedisClient, in_memory_limiter
from app.middleware.rate_limit import RateLimitMiddleware
from app.api.routes import (
    auth,
    profiles,
    recommendations,
    recipes,
    meals,
    progress,
    leaderboard,
    admin,
)

# Configure logging
logging.basicConfig(
    level=logging.DEBUG if settings.DEBUG else logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler for startup/shutdown events"""
    # Startup
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    
    # Try to connect to Redis
    redis = await RedisClient.get_client()
    if redis:
        logger.info("Redis connected - using distributed rate limiting")
    else:
        logger.warning("Redis not available - using in-memory rate limiting")
    
    yield
    
    # Shutdown
    logger.info("Shutting down...")
    await RedisClient.close()
    
    # Cleanup in-memory limiter
    in_memory_limiter.cleanup_old_entries()


def create_application() -> FastAPI:
    """Create and configure the FastAPI application"""
    
    application = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description=(
            "SnackTrack delivers personalized, affordable, and health-aware meal planning "
            "powered by user preferences, health data, budget constraints, and regional insights."
        ),
        lifespan=lifespan,
        docs_url="/docs",
        redoc_url="/redoc",
    )
    
    # CORS middleware (must be added first)
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=[
            "X-RateLimit-Limit",
            "X-RateLimit-Remaining",
            "X-RateLimit-Reset",
        ],
    )
    
    # Rate limiting middleware
    application.add_middleware(RateLimitMiddleware)
    
    # Include routers
    application.include_router(
        auth.router,
        prefix="/api/v1/auth",
        tags=["authentication"],
    )
    application.include_router(
        profiles.router,
        prefix="/api/v1/profiles",
        tags=["profiles"],
    )
    application.include_router(
        recommendations.router,
        prefix="/api/v1/recommendations",
        tags=["recommendations"],
    )
    application.include_router(
        recipes.router,
        prefix="/api/v1/recipes",
        tags=["recipes"],
    )
    application.include_router(
        meals.router,
        prefix="/api/v1/meals",
        tags=["meals"],
    )
    application.include_router(
        progress.router,
        prefix="/api/v1/progress",
        tags=["progress"],
    )
    application.include_router(
        leaderboard.router,
        prefix="/api/v1/leaderboard",
        tags=["leaderboard"],
    )
    application.include_router(
        admin.router,
        prefix="/api/v1/admin",
        tags=["admin"],
    )
    
    # Health check endpoints
    @application.get("/", tags=["health"])
    async def root():
        """Root endpoint - basic health check"""
        return {
            "status": "healthy",
            "service": settings.APP_NAME,
            "version": settings.APP_VERSION,
        }
    
    @application.get("/health", tags=["health"])
    async def health_check():
        """Detailed health check for load balancer"""
        redis_status = "connected" if RedisClient.is_connected() else "disconnected"
        return {
            "status": "ok",
            "redis": redis_status,
            "rate_limiting": "redis" if RedisClient.is_connected() else "in-memory",
        }

    return application


app = create_application()
