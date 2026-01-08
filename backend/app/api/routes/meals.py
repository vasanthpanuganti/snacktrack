from typing import List, Optional
from datetime import date, datetime
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

from app.services.usda import usda_service

router = APIRouter()


class MealLogEntry(BaseModel):
    """A logged meal entry"""
    id: str
    name: str
    calories: int
    protein: float
    carbs: float
    fat: float
    meal_type: str  # breakfast, lunch, dinner, snack
    time: str
    recipe_id: Optional[str] = None


class DailyLog(BaseModel):
    """Daily nutrition log"""
    id: str
    user_id: str
    date: date
    meals: List[MealLogEntry]
    total_calories: int
    total_protein: float
    total_carbs: float
    total_fat: float
    water_glasses: int = 0
    weight: Optional[float] = None
    notes: Optional[str] = None
    mood: Optional[str] = None  # great, good, okay, bad


class MealLogCreate(BaseModel):
    """Request to log a meal"""
    name: str
    calories: int
    protein: float
    carbs: float
    fat: float
    meal_type: str
    recipe_id: Optional[str] = None
    fdc_id: Optional[int] = None  # USDA FoodData Central ID for automatic nutrition lookup


class WaterLogUpdate(BaseModel):
    """Update water intake"""
    glasses: int = Field(..., ge=0, le=20)


# Sample daily log data
sample_logs: dict = {}


@router.get("/daily/{date_str}", response_model=DailyLog, summary="Get daily log")
async def get_daily_log(date_str: str, user_id: str = Query(default="demo-user")):
    """Get the daily nutrition log for a specific date"""
    # Parse date
    try:
        log_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    
    # Return sample data
    return DailyLog(
        id=f"log_{date_str}",
        user_id=user_id,
        date=log_date,
        meals=[
            MealLogEntry(
                id="meal_1",
                name="Avocado Toast with Eggs",
                calories=380,
                protein=14,
                carbs=32,
                fat=22,
                meal_type="breakfast",
                time="08:00"
            ),
            MealLogEntry(
                id="meal_2",
                name="Grilled Chicken Salad",
                calories=420,
                protein=35,
                carbs=18,
                fat=24,
                meal_type="lunch",
                time="12:30"
            ),
            MealLogEntry(
                id="meal_3",
                name="Greek Yogurt with Berries",
                calories=180,
                protein=12,
                carbs=22,
                fat=4,
                meal_type="snack",
                time="15:00"
            ),
        ],
        total_calories=980,
        total_protein=61,
        total_carbs=72,
        total_fat=50,
        water_glasses=5,
        mood="good"
    )


@router.post("/log", response_model=MealLogEntry, summary="Log a meal")
async def log_meal(meal: MealLogCreate, user_id: str = Query(default="demo-user")):
    """Log a new meal for the current day. If fdc_id is provided, nutrition data will be fetched from USDA API."""
    calories = meal.calories
    protein = meal.protein
    carbs = meal.carbs
    fat = meal.fat

    # If USDA FDC ID is provided, fetch nutrition data automatically
    if meal.fdc_id and usda_service.api_key:
        try:
            food_nutrition = await usda_service.get_food_by_id(meal.fdc_id)
            # Use USDA data if available, otherwise use provided values
            calories = int(food_nutrition.calories) if food_nutrition.calories else calories
            protein = food_nutrition.protein if food_nutrition.protein else protein
            carbs = food_nutrition.carbs if food_nutrition.carbs else carbs
            fat = food_nutrition.fat if food_nutrition.fat else fat
        except HTTPException:
            # If USDA lookup fails, use provided values
            pass
        except Exception:
            # If USDA lookup fails, use provided values
            pass

    entry = MealLogEntry(
        id=f"meal_{datetime.now().timestamp()}",
        name=meal.name,
        calories=calories,
        protein=protein,
        carbs=carbs,
        fat=fat,
        meal_type=meal.meal_type,
        time=datetime.now().strftime("%H:%M"),
        recipe_id=meal.recipe_id
    )
    return entry


@router.post("/log-batch", response_model=List[MealLogEntry], summary="Log multiple meals at once")
async def log_meals_batch(meals: List[MealLogCreate], user_id: str = Query(default="demo-user")):
    """
    Log multiple meals at once. More efficient than logging individually.
    Automatically fetches nutrition data from USDA API for meals with fdc_id.
    """
    # Collect all FDC IDs that need nutrition lookup
    fdc_ids = [m.fdc_id for m in meals if m.fdc_id]
    nutrition_map = {}

    # Batch fetch nutrition data if needed
    if fdc_ids and usda_service.api_key:
        try:
            # Use batch endpoint (max 20 at a time)
            if len(fdc_ids) <= 20:
                nutrition_data = await usda_service.get_foods_by_ids(fdc_ids)
                nutrition_map = {food.fdc_id: food for food in nutrition_data}
            else:
                # Split into batches of 20
                for i in range(0, len(fdc_ids), 20):
                    batch = fdc_ids[i:i+20]
                    nutrition_data = await usda_service.get_foods_by_ids(batch)
                    nutrition_map.update({food.fdc_id: food for food in nutrition_data})
        except Exception:
            # If batch lookup fails, continue with provided values
            pass

    # Create meal log entries
    entries = []
    for meal in meals:
        # Use USDA data if available
        if meal.fdc_id and meal.fdc_id in nutrition_map:
            food_nutrition = nutrition_map[meal.fdc_id]
            calories = int(food_nutrition.calories) if food_nutrition.calories else meal.calories
            protein = food_nutrition.protein if food_nutrition.protein else meal.protein
            carbs = food_nutrition.carbs if food_nutrition.carbs else meal.carbs
            fat = food_nutrition.fat if food_nutrition.fat else meal.fat
        else:
            calories = meal.calories
            protein = meal.protein
            carbs = meal.carbs
            fat = meal.fat

        entry = MealLogEntry(
            id=f"meal_{datetime.now().timestamp()}_{len(entries)}",
            name=meal.name,
            calories=calories,
            protein=protein,
            carbs=carbs,
            fat=fat,
            meal_type=meal.meal_type,
            time=datetime.now().strftime("%H:%M"),
            recipe_id=meal.recipe_id
        )
        entries.append(entry)

    return entries


@router.put("/water/{date_str}", summary="Update water intake")
async def update_water(date_str: str, water: WaterLogUpdate, user_id: str = Query(default="demo-user")):
    """Update water intake for a specific date"""
    return {"date": date_str, "water_glasses": water.glasses, "message": "Water intake updated"}


@router.get("/history", summary="Get meal history")
async def get_meal_history(
    user_id: str = Query(default="demo-user"),
    days: int = Query(default=7, ge=1, le=90)
):
    """Get meal history for the past N days"""
    return {
        "user_id": user_id,
        "days": days,
        "summary": {
            "avg_calories": 1850,
            "avg_protein": 95,
            "avg_carbs": 180,
            "avg_fat": 65,
            "adherence_rate": 87
        }
    }


