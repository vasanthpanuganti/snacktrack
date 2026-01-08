"""
USDA FoodData Central API Service

This service handles all interactions with the USDA FoodData Central API,
providing nutrition data for foods to support meal logging and tracking.
"""

import logging
from typing import List, Optional, Dict, Any
import time
import httpx
from fastapi import HTTPException
from pydantic import BaseModel

from app.core.config import settings
from app.core.redis import RedisClient, in_memory_limiter
from app.core.cache import cached, TTL_1_HOUR, TTL_7_DAYS

logger = logging.getLogger(__name__)

USDA_BASE_URL = "https://api.nal.usda.gov/fdc/v1"
USDA_RATE_LIMIT_PER_HOUR = 1000  # USDA default rate limit


class FoodItem(BaseModel):
    """Simplified food item model for search results"""
    fdc_id: int
    name: str
    brand_owner: Optional[str] = None
    data_type: Optional[str] = None
    description: Optional[str] = None


class FoodNutrition(BaseModel):
    """Nutrition information for a food item"""
    fdc_id: int
    name: str
    calories: float
    protein: float
    carbs: float
    fat: float
    fiber: Optional[float] = None
    sugar: Optional[float] = None
    sodium: Optional[float] = None
    serving_size: Optional[float] = None
    serving_unit: Optional[str] = None
    brand_owner: Optional[str] = None
    data_type: Optional[str] = None
    description: Optional[str] = None


class USDAFoodService:
    """Service for interacting with USDA FoodData Central API"""

    def __init__(self):
        self.api_key = settings.USDA_API_KEY
        if not self.api_key:
            logger.warning("USDA API key not configured. Food nutrition lookup will not be available.")

    async def _check_rate_limit(self) -> None:
        """
        Check if we're within the rate limit (1000 requests/hour) using Redis.
        Falls back to in-memory rate limiting if Redis is unavailable.
        """
        now = int(time.time())
        # Use hourly windows for USDA rate limit
        window = now // 3600  # 1-hour buckets
        key = f"usda:rl:{window}"

        redis_client = await RedisClient.get_client()

        if redis_client:
            try:
                # Atomic increment with Redis
                current = await redis_client.incr(key)

                # Set expiry on first request in window
                if current == 1:
                    await redis_client.expire(key, 3660)  # 61 minutes for safety

                if current > USDA_RATE_LIMIT_PER_HOUR:
                    raise HTTPException(
                        status_code=429,
                        detail=f"USDA API rate limit exceeded. Limit: {USDA_RATE_LIMIT_PER_HOUR} requests/hour"
                    )
                return
            except HTTPException:
                raise
            except Exception as e:
                logger.error(f"Redis error in USDA rate limiting: {e}")
                # Fall through to in-memory fallback

        # Fallback to in-memory rate limiting
        is_allowed, current_count = in_memory_limiter.check_and_increment(
            key,
            USDA_RATE_LIMIT_PER_HOUR,
            window_seconds=3600
        )

        if not is_allowed:
            raise HTTPException(
                status_code=429,
                detail=f"USDA API rate limit exceeded. Limit: {USDA_RATE_LIMIT_PER_HOUR} requests/hour"
            )
    
    def _get_params(self, additional_params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Get base parameters including API key"""
        params = {"api_key": self.api_key}
        if additional_params:
            params.update(additional_params)
        return params
    
    async def _make_request(
        self,
        endpoint: str,
        params: Optional[Dict[str, Any]] = None,
        method: str = "GET",
        json_data: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Make a request to USDA FoodData Central API"""
        if not self.api_key:
            raise HTTPException(
                status_code=503,
                detail="USDA API key not configured"
            )

        # Check rate limit
        await self._check_rate_limit()
        
        url = f"{USDA_BASE_URL}{endpoint}"
        request_params = self._get_params(params)
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                if method == "POST":
                    response = await client.post(
                        url,
                        params=request_params,
                        json=json_data,
                        headers={"Content-Type": "application/json"}
                    )
                else:
                    response = await client.get(url, params=request_params)
                
                if response.status_code == 401:
                    raise HTTPException(
                        status_code=401,
                        detail="Invalid USDA API key"
                    )
                elif response.status_code == 403:
                    raise HTTPException(
                        status_code=403,
                        detail="USDA API access forbidden. Check your API key."
                    )
                elif response.status_code == 429:
                    raise HTTPException(
                        status_code=429,
                        detail="USDA API rate limit exceeded. Limit: 1,000 requests/hour"
                    )
                
                response.raise_for_status()
                
                # Handle empty responses
                if response.status_code == 200 and not response.text:
                    return {}
                
                return response.json()
        except httpx.HTTPError as e:
            logger.error(f"USDA API request failed: {e}")
            raise HTTPException(
                status_code=503,
                detail=f"Failed to connect to USDA API: {str(e)}"
            )
    
    def _extract_nutrient(self, nutrients: List[Dict], nutrient_id: int, default: float = 0.0) -> float:
        """Extract a specific nutrient value from nutrients list"""
        for nutrient in nutrients:
            if nutrient.get("nutrientId") == nutrient_id:
                return nutrient.get("amount", default)
        return default
    
    def _map_usda_food_to_nutrition(self, food_data: Dict[str, Any]) -> FoodNutrition:
        """Map USDA food data to our FoodNutrition model"""
        fdc_id = food_data.get("fdcId", 0)
        name = food_data.get("description", "Unknown Food")
        
        # Extract nutrients (nutrient IDs from USDA standard)
        # Common nutrient IDs: 1008 = Energy (kcal), 1003 = Protein, 1005 = Carbs, 1004 = Fat
        nutrients = food_data.get("foodNutrients", [])
        
        calories = self._extract_nutrient(nutrients, 1008)  # Energy (kcal)
        protein = self._extract_nutrient(nutrients, 1003)  # Protein
        carbs = self._extract_nutrient(nutrients, 1005)    # Carbohydrates
        fat = self._extract_nutrient(nutrients, 1004)      # Fat
        fiber = self._extract_nutrient(nutrients, 1079, None)  # Fiber (optional)
        sugar = self._extract_nutrient(nutrients, 2000, None)  # Sugars (optional)
        sodium = self._extract_nutrient(nutrients, 1093, None)  # Sodium (optional)
        
        # Extract serving information if available
        serving_size = None
        serving_unit = None
        food_portion = food_data.get("foodPortions")
        if food_portion and len(food_portion) > 0:
            portion = food_portion[0]
            serving_size = portion.get("amount")
            serving_unit = portion.get("measureUnit", {}).get("name")
        
        return FoodNutrition(
            fdc_id=fdc_id,
            name=name,
            calories=round(calories, 2),
            protein=round(protein, 2),
            carbs=round(carbs, 2),
            fat=round(fat, 2),
            fiber=round(fiber, 2) if fiber else None,
            sugar=round(sugar, 2) if sugar else None,
            sodium=round(sodium, 2) if sodium else None,
            serving_size=serving_size,
            serving_unit=serving_unit,
            brand_owner=food_data.get("brandOwner"),
            data_type=food_data.get("dataType"),
            description=food_data.get("description"),
        )
    
    def _map_usda_search_result(self, food_item: Dict[str, Any]) -> FoodItem:
        """Map USDA search result to FoodItem model"""
        return FoodItem(
            fdc_id=food_item.get("fdcId", 0),
            name=food_item.get("description", "Unknown Food"),
            brand_owner=food_item.get("brandOwner"),
            data_type=food_item.get("dataType"),
            description=food_item.get("additionalDescriptions") or food_item.get("description"),
        )
    
    @cached(ttl=TTL_1_HOUR, prefix="usda:search")
    async def search_foods(
        self,
        query: str,
        page_size: int = 50,
        page_number: int = 1,
        data_type: Optional[List[str]] = None,
        brand_owner: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Search for foods using USDA API (cached for 1 hour)
        
        Args:
            query: Search query (food name)
            page_size: Number of results per page (max 200)
            page_number: Page number (1-indexed)
            data_type: Filter by data type (e.g., ["Branded", "Foundation", "SR Legacy"])
            brand_owner: Filter by brand owner
        
        Returns:
            Dictionary with 'foods' list and 'totalHits' count
        """
        if not query or not query.strip():
            raise HTTPException(status_code=400, detail="Search query cannot be empty")
        
        page_size = min(page_size, 200)  # USDA max is 200
        
        params = {
            "pageSize": page_size,
            "pageNumber": page_number,
        }
        
        # Use POST for more complex queries
        json_data = {
            "query": query,
        }
        
        if data_type:
            json_data["dataType"] = data_type
        
        if brand_owner:
            json_data["brandOwner"] = brand_owner
        
        try:
            data = await self._make_request("/foods/search", params=params, method="POST", json_data=json_data)
            
            foods = [self._map_usda_search_result(item) for item in data.get("foods", [])]
            
            return {
                "foods": foods,
                "total_hits": data.get("totalHits", 0),
                "current_page": page_number,
                "total_pages": data.get("totalPages", 0),
            }
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error searching foods: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to search foods: {str(e)}")
    
    @cached(ttl=TTL_7_DAYS, prefix="usda:food")
    async def get_food_by_id(self, fdc_id: int) -> FoodNutrition:
        """Get detailed nutrition information for a food by FDC ID (cached for 7 days)"""
        try:
            food_data = await self._make_request(f"/food/{fdc_id}")
            
            if not food_data or not food_data.get("fdcId"):
                raise HTTPException(status_code=404, detail=f"Food with FDC ID {fdc_id} not found")
            
            return self._map_usda_food_to_nutrition(food_data)
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error fetching food {fdc_id}: {e}")
            raise HTTPException(status_code=404, detail=f"Food {fdc_id} not found")
    
    async def get_foods_by_ids(self, fdc_ids: List[int]) -> List[FoodNutrition]:
        """Get detailed nutrition information for multiple foods by FDC IDs"""
        if not fdc_ids:
            return []
        
        if len(fdc_ids) > 20:
            raise HTTPException(status_code=400, detail="Maximum 20 food IDs per request")
        
        try:
            json_data = {"fdcIds": fdc_ids}
            foods_data = await self._make_request("/foods", method="POST", json_data=json_data)
            
            if not isinstance(foods_data, list):
                foods_data = []
            
            return [self._map_usda_food_to_nutrition(food) for food in foods_data]
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error fetching foods: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to fetch foods: {str(e)}")


# Singleton instance
usda_service = USDAFoodService()

