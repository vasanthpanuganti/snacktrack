from datetime import date
from typing import List

from fastapi import APIRouter

from app.schemas.recommendations import MealPlanResponse, RecommendationRequest
from app.services.recommendations import RecommendationEngine

router = APIRouter()
engine = RecommendationEngine()


@router.post(
    "/meal-plan",
    response_model=MealPlanResponse,
    summary="Generate a personalized meal plan",
)
def generate_meal_plan(request: RecommendationRequest) -> MealPlanResponse:
    return engine.generate_plan(request)


@router.get(
    "/sample",
    response_model=MealPlanResponse,
    summary="Fetch a sample meal plan for demo purposes",
)
def sample_meal_plan() -> MealPlanResponse:
    request = RecommendationRequest(
        profile_id="demo-user",
        target_date=date.today(),
        meals_per_day=3,
    )
    return engine.generate_plan(request)
