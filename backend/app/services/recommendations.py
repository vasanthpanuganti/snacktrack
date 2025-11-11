from datetime import date, timedelta
from typing import Dict, List

from app.schemas.recommendations import DailyMealPlan, MealItem, MealPlanResponse, RecommendationRequest


class RecommendationEngine:
    """Rule-based engine prepared for future ML integration."""

    DEFAULT_MACROS: Dict[str, float] = {"protein": 30.0, "carbs": 45.0, "fat": 25.0}

    def generate_plan(self, request: RecommendationRequest) -> MealPlanResponse:
        meals: List[MealItem] = [
            MealItem(
                recipe_id="herb-quinoa",
                title="Herb-Infused Quinoa Bowl",
                calories=420,
                macros={"protein": 18, "carbs": 55, "fat": 12},
                ingredients=["quinoa", "olive oil", "parsley", "feta"],
            )
        ]

        plan = [
            DailyMealPlan(
                day=request.target_date + timedelta(days=offset),
                meals=meals * request.meals_per_day,
            )
            for offset in range(3)
        ]

        total_calories = sum(meal.calories for day in plan for meal in day.meals)

        return MealPlanResponse(
            profile_id=request.profile_id,
            total_calories=total_calories,
            macro_distribution=self.DEFAULT_MACROS,
            plan=plan,
        )
