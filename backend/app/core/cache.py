"""
API Response Caching Module

Provides decorator and utility functions for caching external API responses
using Redis with automatic fallback to in-memory caching.
"""

import json
import hashlib
import logging
from typing import Optional, Any, Callable
from functools import wraps

from app.core.redis import RedisClient

logger = logging.getLogger(__name__)


class InMemoryCache:
    """Simple in-memory cache for development without Redis"""

    def __init__(self, max_size: int = 1000):
        self._cache: dict[str, tuple[Any, float]] = {}
        self._max_size = max_size

    def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        import time
        if key in self._cache:
            value, expiry = self._cache[key]
            if expiry > time.time():
                return value
            else:
                del self._cache[key]
        return None

    def set(self, key: str, value: Any, ttl: int) -> None:
        """Set value in cache with TTL in seconds"""
        import time
        # Simple size management - remove oldest if at limit
        if len(self._cache) >= self._max_size:
            oldest_key = next(iter(self._cache))
            del self._cache[oldest_key]

        expiry = time.time() + ttl
        self._cache[key] = (value, expiry)

    def delete(self, key: str) -> None:
        """Delete value from cache"""
        if key in self._cache:
            del self._cache[key]

    def clear(self) -> None:
        """Clear all cache entries"""
        self._cache.clear()


# Singleton instance
in_memory_cache = InMemoryCache()


def generate_cache_key(prefix: str, *args, **kwargs) -> str:
    """
    Generate a cache key from function arguments.

    Args:
        prefix: Cache key prefix (e.g., 'spoonacular:search')
        *args: Positional arguments
        **kwargs: Keyword arguments

    Returns:
        Cache key string
    """
    # Create a stable string representation of arguments
    key_parts = [prefix]

    # Add args
    for arg in args:
        if arg is not None:
            key_parts.append(str(arg))

    # Add sorted kwargs (for stability)
    for k, v in sorted(kwargs.items()):
        if v is not None:
            key_parts.append(f"{k}:{v}")

    # Generate hash for long keys
    key_string = ":".join(key_parts)
    if len(key_string) > 200:
        key_hash = hashlib.md5(key_string.encode()).hexdigest()
        return f"{prefix}:hash:{key_hash}"

    return key_string


async def cache_get(key: str) -> Optional[Any]:
    """
    Get value from cache (Redis or in-memory fallback).

    Args:
        key: Cache key

    Returns:
        Cached value or None if not found
    """
    redis_client = await RedisClient.get_client()

    if redis_client:
        try:
            value = await redis_client.get(key)
            if value:
                # Deserialize JSON
                return json.loads(value)
        except Exception as e:
            logger.warning(f"Redis cache get error: {e}")
            # Fall through to in-memory

    # Fallback to in-memory cache
    return in_memory_cache.get(key)


async def cache_set(key: str, value: Any, ttl: int) -> None:
    """
    Set value in cache with TTL (Redis or in-memory fallback).

    Args:
        key: Cache key
        value: Value to cache (must be JSON serializable)
        ttl: Time to live in seconds
    """
    redis_client = await RedisClient.get_client()

    if redis_client:
        try:
            # Serialize to JSON
            serialized = json.dumps(value)
            await redis_client.setex(key, ttl, serialized)
            return
        except Exception as e:
            logger.warning(f"Redis cache set error: {e}")
            # Fall through to in-memory

    # Fallback to in-memory cache
    in_memory_cache.set(key, value, ttl)


async def cache_delete(key: str) -> None:
    """
    Delete value from cache.

    Args:
        key: Cache key
    """
    redis_client = await RedisClient.get_client()

    if redis_client:
        try:
            await redis_client.delete(key)
        except Exception as e:
            logger.warning(f"Redis cache delete error: {e}")

    # Also delete from in-memory cache
    in_memory_cache.delete(key)


def cached(ttl: int, prefix: str):
    """
    Decorator for caching async function results.

    Args:
        ttl: Time to live in seconds
        prefix: Cache key prefix

    Example:
        @cached(ttl=3600, prefix="spoonacular:recipe")
        async def get_recipe(recipe_id: int):
            # ... expensive API call ...
            return recipe_data
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Generate cache key from arguments
            # Skip 'self' argument for methods
            cache_args = args[1:] if args and hasattr(args[0], '__dict__') else args
            cache_key = generate_cache_key(prefix, *cache_args, **kwargs)

            # Try to get from cache
            cached_value = await cache_get(cache_key)
            if cached_value is not None:
                logger.debug(f"Cache hit: {cache_key}")
                return cached_value

            # Cache miss - call function
            logger.debug(f"Cache miss: {cache_key}")
            result = await func(*args, **kwargs)

            # Store in cache
            await cache_set(cache_key, result, ttl)

            return result

        return wrapper
    return decorator


# TTL constants (in seconds)
TTL_1_HOUR = 3600
TTL_6_HOURS = 21600
TTL_24_HOURS = 86400
TTL_7_DAYS = 604800
