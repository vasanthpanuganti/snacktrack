"""
Spoonacular API Service

This service handles all interactions with the Spoonacular API,
converting their response format to our internal recipe models.
"""

import logging
from typing import List, Optional, Dict, Any, TYPE_CHECKING
import httpx
from fastapi import HTTPException
from pydantic import BaseModel

from app.core.config import settings

if TYPE_CHECKING:
    from app.api.routes.recipes import RecipeResponse, NutritionInfo, Ingredient

logger = logging.getLogger(__name__)

# Define models here to avoid circular imports
class Ingredient(BaseModel):
    name: str
    amount: float
    unit: str
    calories: Optional[float] = None
    optional: bool = False


class NutritionInfo(BaseModel):
    calories: int
    protein: float
    carbs: float
    fat: float
    fiber: Optional[float] = None


class RecipeResponse(BaseModel):
    id: str
    title: str
    description: str
    cuisine: str
    meal_type: str
    prep_time: int
    cook_time: int
    servings: int
    nutrition: NutritionInfo
    ingredients: List[Ingredient]
    instructions: List[str]
    tags: List[str]
    region: str
    cost_per_serving: Optional[float] = None
    health_benefits: List[str] = []
    suitable_for: List[str] = []
    not_suitable_for: List[str] = []
    image_url: Optional[str] = None
    rating: float = 0
    review_count: int = 0

SPOONACULAR_BASE_URL = "https://api.spoonacular.com"


class SpoonacularService:
    """Service for interacting with Spoonacular API"""
    
    def __init__(self):
        self.api_key = settings.SPOONACULAR_API_KEY
        if not self.api_key:
            logger.warning("Spoonacular API key not configured. Recipe endpoints will use sample data.")
    
    def _get_headers(self) -> Dict[str, str]:
        """Get headers for Spoonacular API requests"""
        return {
            "Content-Type": "application/json",
        }
    
    def _get_params(self, additional_params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Get base parameters including API key"""
        params = {"apiKey": self.api_key}
        if additional_params:
            params.update(additional_params)
        return params
    
    async def _make_request(self, endpoint: str, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Make a request to Spoonacular API"""
        if not self.api_key:
            raise HTTPException(
                status_code=503,
                detail="Spoonacular API key not configured"
            )
        
        url = f"{SPOONACULAR_BASE_URL}{endpoint}"
        request_params = self._get_params(params)
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(url, params=request_params, headers=self._get_headers())
                
                if response.status_code == 401:
                    raise HTTPException(
                        status_code=401,
                        detail="Invalid Spoonacular API key"
                    )
                elif response.status_code == 402:
                    raise HTTPException(
                        status_code=402,
                        detail="Spoonacular API quota exceeded. Please check your plan."
                    )
                elif response.status_code == 429:
                    raise HTTPException(
                        status_code=429,
                        detail="Spoonacular API rate limit exceeded. Please try again later."
                    )
                
                response.raise_for_status()
                return response.json()
        except httpx.HTTPError as e:
            logger.error(f"Spoonacular API request failed: {e}")
            raise HTTPException(
                status_code=503,
                detail=f"Failed to connect to Spoonacular API: {str(e)}"
            )
    
    def _map_spoonacular_recipe(self, recipe: Dict[str, Any]) -> RecipeResponse:
        """Map Spoonacular recipe format to our RecipeResponse model"""
        # Extract nutrition information
        nutrition_data = recipe.get("nutrition", {}) or {}
        nutrients = nutrition_data.get("nutrients", [])
        
        # Find specific nutrients
        calories = next((n["amount"] for n in nutrients if n["name"] == "Calories"), 0)
        protein = next((n["amount"] for n in nutrients if n["name"] == "Protein"), 0)
        carbs = next((n["amount"] for n in nutrients if n["name"] == "Carbohydrates"), 0)
        fat = next((n["amount"] for n in nutrients if n["name"] == "Fat"), 0)
        fiber = next((n["amount"] for n in nutrients if n["name"] == "Fiber"), None)
        
        # Map ingredients
        ingredients_list = recipe.get("extendedIngredients", [])
        ingredients = [
            Ingredient(
                name=ing.get("nameClean", ing.get("name", "")),
                amount=ing.get("amount", 0),
                unit=ing.get("unit", ""),
                calories=next(
                    (n["amount"] for n in ing.get("nutrition", {}).get("nutrients", []) if n["name"] == "Calories"),
                    None
                ),
            )
            for ing in ingredients_list
        ]
        
        # Extract instructions
        analyzed_instructions = recipe.get("analyzedInstructions", [])
        instructions = []
        if analyzed_instructions:
            steps = analyzed_instructions[0].get("steps", [])
            instructions = [step.get("step", "") for step in steps]
        
        # Extract diet tags
        diets = recipe.get("diets", [])
        dish_types = recipe.get("dishTypes", [])
        tags = diets + dish_types
        
        # Determine meal type from dish types
        meal_type = "lunch"  # default
        dish_types_lower = [d.lower() for d in dish_types]
        if any(mt in dish_types_lower for mt in ["breakfast", "morning meal"]):
            meal_type = "breakfast"
        elif any(mt in dish_types_lower for mt in ["dinner", "main course"]):
            meal_type = "dinner"
        elif any(mt in dish_types_lower for mt in ["snack"]):
            meal_type = "snack"
        
        return RecipeResponse(
            id=str(recipe.get("id", "")),
            title=recipe.get("title", ""),
            description=recipe.get("summary", "").replace("<b>", "").replace("</b>", "")[:200] if recipe.get("summary") else "",
            cuisine=recipe.get("cuisines", [None])[0] or "International",
            meal_type=meal_type,
            prep_time=recipe.get("preparationMinutes", 0) or recipe.get("readyInMinutes", 0),
            cook_time=recipe.get("cookingMinutes", 0),
            servings=recipe.get("servings", 2),
            nutrition=NutritionInfo(
                calories=int(calories),
                protein=round(protein, 1),
                carbs=round(carbs, 1),
                fat=round(fat, 1),
                fiber=round(fiber, 1) if fiber else None,
            ),
            ingredients=ingredients,
            instructions=instructions,
            tags=tags,
            region="Global",  # Spoonacular doesn't provide region directly
            cost_per_serving=recipe.get("pricePerServing", 0) / 100 if recipe.get("pricePerServing") else None,
            health_benefits=[],  # Spoonacular doesn't provide this directly
            suitable_for=diets,
            not_suitable_for=[],  # Would need to check for allergens
            image_url=recipe.get("image"),
            rating=recipe.get("spoonacularScore", 0) / 100 if recipe.get("spoonacularScore") else 0,
            review_count=recipe.get("aggregateLikes", 0),
        )
    
    async def search_recipes(
        self,
        query: Optional[str] = None,
        cuisine: Optional[str] = None,
        diet: Optional[str] = None,
        exclude_ingredients: Optional[str] = None,
        max_calories: Optional[int] = None,
        max_prep_time: Optional[int] = None,
        offset: int = 0,
        limit: int = 20,
    ) -> List[RecipeResponse]:
        """Search for recipes using Spoonacular API"""
        params = {
            "number": min(limit, 100),  # Spoonacular max is 100
            "offset": offset,
            "addRecipeInformation": True,
            "addRecipeNutrition": True,
            "fillIngredients": True,
        }
        
        if query:
            params["query"] = query
        if cuisine:
            params["cuisine"] = cuisine
        if diet:
            params["diet"] = diet
        if exclude_ingredients:
            params["excludeIngredients"] = exclude_ingredients
        if max_calories:
            params["maxCalories"] = max_calories
        if max_prep_time:
            params["maxReadyTime"] = max_prep_time
        
        try:
            data = await self._make_request("/recipes/complexSearch", params)
            results = data.get("results", [])
            
            recipes = []
            for recipe in results:
                try:
                    recipes.append(self._map_spoonacular_recipe(recipe))
                except Exception as e:
                    logger.warning(f"Failed to map recipe {recipe.get('id')}: {e}")
                    continue
            
            return recipes
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error searching recipes: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to search recipes: {str(e)}")
    
    async def get_recipe_by_id(self, recipe_id: int) -> RecipeResponse:
        """Get a specific recipe by ID from Spoonacular"""
        params = {
            "includeNutrition": True,
        }
        
        try:
            recipe = await self._make_request(f"/recipes/{recipe_id}/information", params)
            return self._map_spoonacular_recipe(recipe)
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error fetching recipe {recipe_id}: {e}")
            raise HTTPException(status_code=404, detail=f"Recipe {recipe_id} not found")
    
    async def get_recipe_alternatives(
        self,
        recipe_id: int,
        limit: int = 3,
    ) -> List[RecipeResponse]:
        """Get alternative recipes similar to the given recipe"""
        try:
            # First get the original recipe to know its nutrition profile
            original = await self.get_recipe_by_id(recipe_id)
            
            # Search for similar recipes based on calories and macros
            params = {
                "number": limit,
                "maxCalories": original.nutrition.calories + 100,
                "minCalories": max(0, original.nutrition.calories - 100),
                "addRecipeInformation": True,
                "addRecipeNutrition": True,
                "fillIngredients": True,
            }
            
            data = await self._make_request("/recipes/complexSearch", params)
            results = data.get("results", [])
            
            # Filter out the original recipe
            alternatives = [
                self._map_spoonacular_recipe(r)
                for r in results
                if str(r.get("id")) != str(recipe_id)
            ]
            
            return alternatives[:limit]
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error fetching alternatives for recipe {recipe_id}: {e}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to fetch recipe alternatives: {str(e)}"
            )


# Singleton instance
spoonacular_service = SpoonacularService()

