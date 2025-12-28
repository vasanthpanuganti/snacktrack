from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

router = APIRouter()


class MacroTargets(BaseModel):
    protein: float
    carbs: float
    fat: float


class ProfileCreate(BaseModel):
    name: str
    email: Optional[str] = None
    age: int = Field(..., ge=1, le=120)
    height: float = Field(..., gt=0)
    weight: float = Field(..., gt=0)
    gender: str
    activity_level: str
    goal: str
    target_weight: Optional[float] = None
    diet_type: str
    restrictions: List[str] = []
    allergies: List[str] = []
    health_conditions: List[str] = []
    daily_budget: Optional[float] = None
    weekly_budget: Optional[float] = None
    currency: str = "USD"
    region: str
    preferred_cuisines: List[str] = []


class ProfileResponse(BaseModel):
    id: str
    name: str
    email: Optional[str] = None
    age: int
    height: float
    weight: float
    gender: str
    activity_level: str
    goal: str
    target_weight: Optional[float] = None
    diet_type: str
    restrictions: List[str]
    allergies: List[str]
    favorite_foods: List[str] = []
    disliked_foods: List[str] = []
    health_conditions: List[str]
    daily_budget: Optional[float] = None
    weekly_budget: Optional[float] = None
    currency: str
    region: str
    preferred_cuisines: List[str]
    current_streak: int = 0
    longest_streak: int = 0
    total_days_tracked: int = 0
    joined_at: datetime
    bmr: Optional[float] = None
    tdee: Optional[float] = None
    daily_calorie_target: Optional[float] = None
    macro_targets: Optional[MacroTargets] = None


class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    activity_level: Optional[str] = None
    goal: Optional[str] = None
    target_weight: Optional[float] = None
    diet_type: Optional[str] = None
    restrictions: Optional[List[str]] = None
    allergies: Optional[List[str]] = None
    favorite_foods: Optional[List[str]] = None
    disliked_foods: Optional[List[str]] = None
    health_conditions: Optional[List[str]] = None
    daily_budget: Optional[float] = None
    weekly_budget: Optional[float] = None
    region: Optional[str] = None
    preferred_cuisines: Optional[List[str]] = None


# Helper functions
def calculate_bmr(weight: float, height: float, age: int, gender: str) -> float:
    """Calculate BMR using Mifflin-St Jeor Equation"""
    if gender.lower() == "male":
        return round(10 * weight + 6.25 * height - 5 * age + 5)
    else:
        return round(10 * weight + 6.25 * height - 5 * age - 161)


def calculate_tdee(bmr: float, activity_level: str) -> float:
    """Calculate TDEE based on activity level"""
    multipliers = {
        "sedentary": 1.2,
        "light": 1.375,
        "moderate": 1.55,
        "active": 1.725,
        "very_active": 1.9,
    }
    return round(bmr * multipliers.get(activity_level, 1.55))


def calculate_calorie_target(tdee: float, goal: str) -> float:
    """Calculate daily calorie target based on goal"""
    if goal == "weight_loss":
        return round(tdee * 0.8)
    elif goal == "muscle_gain":
        return round(tdee * 1.1)
    return tdee


def calculate_macro_targets(calories: float, goal: str) -> MacroTargets:
    """Calculate macro targets based on goal"""
    if goal == "muscle_gain":
        protein_pct, carbs_pct, fat_pct = 0.35, 0.45, 0.20
    elif goal == "weight_loss":
        protein_pct, carbs_pct, fat_pct = 0.35, 0.35, 0.30
    else:
        protein_pct, carbs_pct, fat_pct = 0.30, 0.40, 0.30
    
    return MacroTargets(
        protein=round((calories * protein_pct) / 4),
        carbs=round((calories * carbs_pct) / 4),
        fat=round((calories * fat_pct) / 9),
    )


@router.post("/", response_model=ProfileResponse, summary="Create a new user profile")
async def create_profile(profile: ProfileCreate) -> ProfileResponse:
    """Create a new user profile with calculated nutrition targets"""
    
    bmr = calculate_bmr(profile.weight, profile.height, profile.age, profile.gender)
    tdee = calculate_tdee(bmr, profile.activity_level)
    calorie_target = calculate_calorie_target(tdee, profile.goal)
    macro_targets = calculate_macro_targets(calorie_target, profile.goal)
    
    return ProfileResponse(
        id=f"user_{datetime.now().timestamp()}",
        name=profile.name,
        email=profile.email,
        age=profile.age,
        height=profile.height,
        weight=profile.weight,
        gender=profile.gender,
        activity_level=profile.activity_level,
        goal=profile.goal,
        target_weight=profile.target_weight,
        diet_type=profile.diet_type,
        restrictions=profile.restrictions,
        allergies=profile.allergies,
        health_conditions=profile.health_conditions,
        daily_budget=profile.daily_budget,
        weekly_budget=profile.weekly_budget,
        currency=profile.currency,
        region=profile.region,
        preferred_cuisines=profile.preferred_cuisines,
        joined_at=datetime.now(),
        bmr=bmr,
        tdee=tdee,
        daily_calorie_target=calorie_target,
        macro_targets=macro_targets,
    )


@router.get("/{user_id}", response_model=ProfileResponse, summary="Get user profile")
async def get_profile(user_id: str) -> ProfileResponse:
    """Get a user profile by ID"""
    # Return sample profile for demo
    return ProfileResponse(
        id=user_id,
        name="Demo User",
        email="demo@example.com",
        age=30,
        height=175,
        weight=72.5,
        gender="male",
        activity_level="moderate",
        goal="weight_loss",
        target_weight=70,
        diet_type="non_vegetarian",
        restrictions=[],
        allergies=["peanuts"],
        health_conditions=[],
        daily_budget=15,
        currency="USD",
        region="North America",
        preferred_cuisines=["mediterranean", "japanese"],
        current_streak=18,
        longest_streak=45,
        total_days_tracked=128,
        joined_at=datetime.now(),
        bmr=1700,
        tdee=2635,
        daily_calorie_target=2108,
        macro_targets=MacroTargets(protein=185, carbs=185, fat=70),
    )


@router.put("/{user_id}", response_model=ProfileResponse, summary="Update user profile")
async def update_profile(user_id: str, updates: ProfileUpdate) -> ProfileResponse:
    """Update an existing user profile"""
    # In a real app, fetch the existing profile and apply updates
    # For demo, return updated sample profile
    
    current = await get_profile(user_id)
    
    # Apply updates
    updated_data = current.model_dump()
    for field, value in updates.model_dump(exclude_unset=True).items():
        if value is not None:
            updated_data[field] = value
    
    # Recalculate if relevant fields changed
    if any(updates.model_dump(exclude_unset=True).get(f) for f in ["weight", "height", "age", "activity_level", "goal"]):
        bmr = calculate_bmr(updated_data["weight"], updated_data["height"], updated_data["age"], updated_data["gender"])
        tdee = calculate_tdee(bmr, updated_data["activity_level"])
        calorie_target = calculate_calorie_target(tdee, updated_data["goal"])
        macro_targets = calculate_macro_targets(calorie_target, updated_data["goal"])
        
        updated_data["bmr"] = bmr
        updated_data["tdee"] = tdee
        updated_data["daily_calorie_target"] = calorie_target
        updated_data["macro_targets"] = macro_targets
    
    return ProfileResponse(**updated_data)


@router.get("/", response_model=List[ProfileResponse], summary="List user profiles")
async def list_profiles(limit: int = Query(default=10, ge=1, le=100)) -> List[ProfileResponse]:
    """Return list of profiles (for admin purposes)"""
    sample_profile = await get_profile("demo-user")
    return [sample_profile]


@router.delete("/{user_id}", summary="Delete user profile")
async def delete_profile(user_id: str):
    """Delete a user profile"""
    return {"message": f"Profile {user_id} deleted successfully"}
