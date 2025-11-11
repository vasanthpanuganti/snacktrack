from datetime import date
from typing import Dict, List

from pydantic import BaseModel, Field


class MealItem(BaseModel):
    recipe_id: str
    title: str
    calories: int
    macros: Dict[str, float]
    ingredients: List[str]


class DailyMealPlan(BaseModel):
    day: date
    meals: List[MealItem]


class MealPlanResponse(BaseModel):
    profile_id: str
    total_calories: int
    macro_distribution: Dict[str, float]
    plan: List[DailyMealPlan]


class RecommendationRequest(BaseModel):
    profile_id: str
    target_date: date
    meals_per_day: int = Field(default=3, ge=1, le=6)
