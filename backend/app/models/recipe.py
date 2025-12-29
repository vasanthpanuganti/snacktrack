from typing import List, Optional, Dict
from pydantic import BaseModel, Field


class Ingredient(BaseModel):
    """Single ingredient in a recipe"""
    name: str
    amount: float
    unit: str
    calories: Optional[float] = None
    optional: bool = False


class NutritionInfo(BaseModel):
    """Nutrition information per serving"""
    calories: int
    protein: float
    carbs: float
    fat: float
    fiber: Optional[float] = None
    sugar: Optional[float] = None
    sodium: Optional[float] = None


class Recipe(BaseModel):
    """Complete recipe model"""
    id: str
    title: str
    description: str
    cuisine: str
    meal_type: str = Field(..., description="breakfast, lunch, dinner, snack")
    prep_time: int = Field(..., description="Preparation time in minutes")
    cook_time: int = Field(..., description="Cooking time in minutes")
    servings: int = Field(default=2, ge=1)
    
    # Nutrition
    nutrition: NutritionInfo
    
    # Ingredients & Instructions
    ingredients: List[Ingredient]
    instructions: List[str]
    
    # Categorization
    tags: List[str] = Field(default_factory=list)
    region: str = ""
    cost_per_serving: Optional[float] = None
    
    # Health Information
    health_benefits: List[str] = Field(default_factory=list)
    suitable_for: List[str] = Field(default_factory=list, description="Health conditions this recipe supports")
    not_suitable_for: List[str] = Field(default_factory=list, description="Health conditions to avoid")
    
    # Metadata
    image_url: Optional[str] = None
    rating: float = Field(default=0, ge=0, le=5)
    review_count: int = 0
    status: str = Field(default="published", description="published, draft, archived")


class RecipeCreate(BaseModel):
    """Request model for creating a recipe"""
    title: str
    description: str
    cuisine: str
    meal_type: str
    prep_time: int
    cook_time: int
    servings: int = 2
    nutrition: NutritionInfo
    ingredients: List[Ingredient]
    instructions: List[str]
    tags: List[str] = []
    region: str = ""
    cost_per_serving: Optional[float] = None
    health_benefits: List[str] = []
    suitable_for: List[str] = []
    not_suitable_for: List[str] = []


class RecipeFilter(BaseModel):
    """Filters for searching recipes"""
    cuisine: Optional[str] = None
    meal_type: Optional[str] = None
    max_calories: Optional[int] = None
    max_prep_time: Optional[int] = None
    diet_type: Optional[str] = None
    exclude_allergens: Optional[List[str]] = None
    health_condition: Optional[str] = None
    max_cost: Optional[float] = None
    tags: Optional[List[str]] = None
    search_query: Optional[str] = None


