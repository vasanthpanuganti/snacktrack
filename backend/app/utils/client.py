from typing import Any, Dict

import httpx


async def fetch_json(url: str, params: Dict[str, Any] | None = None) -> Dict[str, Any]:
    """Generic async helper to fetch JSON payloads from third-party APIs."""
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(url, params=params)
        response.raise_for_status()
        return response.json()
