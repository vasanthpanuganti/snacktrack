import redis.asyncio as redis
from typing import Optional
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)


class RedisClient:
    """Redis client wrapper for rate limiting and caching"""
    
    _instance: Optional[redis.Redis] = None
    _is_connected: bool = False
    
    @classmethod
    async def get_client(cls) -> Optional[redis.Redis]:
        """Get or create Redis client"""
        if cls._instance is None:
            try:
                cls._instance = redis.Redis(
                    host=settings.REDIS_HOST,
                    port=settings.REDIS_PORT,
                    password=settings.REDIS_PASSWORD,
                    db=settings.REDIS_DB,
                    decode_responses=True,
                    socket_connect_timeout=5,
                    socket_timeout=5,
                )
                # Test connection
                await cls._instance.ping()
                cls._is_connected = True
                logger.info(f"Connected to Redis at {settings.REDIS_HOST}:{settings.REDIS_PORT}")
            except Exception as e:
                logger.warning(f"Redis connection failed: {e}. Rate limiting will use in-memory fallback.")
                cls._instance = None
                cls._is_connected = False
        
        return cls._instance
    
    @classmethod
    async def close(cls):
        """Close Redis connection"""
        if cls._instance:
            await cls._instance.close()
            cls._instance = None
            cls._is_connected = False
    
    @classmethod
    def is_connected(cls) -> bool:
        """Check if Redis is connected"""
        return cls._is_connected


# In-memory fallback for development without Redis
class InMemoryRateLimiter:
    """Simple in-memory rate limiter for development"""
    
    def __init__(self):
        self._storage: dict[str, tuple[int, float]] = {}  # key -> (count, window_start)
    
    def check_and_increment(self, key: str, limit: int, window_seconds: int = 60) -> tuple[bool, int]:
        """
        Check if request is allowed and increment counter.
        Returns (is_allowed, current_count)
        """
        import time
        now = time.time()
        window_start = now - (now % window_seconds)
        
        if key in self._storage:
            count, stored_window = self._storage[key]
            if stored_window == window_start:
                # Same window
                new_count = count + 1
                self._storage[key] = (new_count, window_start)
                return new_count <= limit, new_count
            else:
                # New window
                self._storage[key] = (1, window_start)
                return True, 1
        else:
            # First request
            self._storage[key] = (1, window_start)
            return True, 1
    
    def cleanup_old_entries(self):
        """Remove entries older than 2 minutes"""
        import time
        now = time.time()
        cutoff = now - 120
        
        keys_to_remove = [
            k for k, (_, window_start) in self._storage.items()
            if window_start < cutoff
        ]
        for k in keys_to_remove:
            del self._storage[k]


# Singleton for in-memory fallback
in_memory_limiter = InMemoryRateLimiter()

