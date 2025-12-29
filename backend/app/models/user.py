from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field


class MacroTargets(BaseModel):
    """Macro nutrient targets in grams"""
    protein: float
    carbs: float
    fat: float
    fiber: Optional[float] = None


class UserProfile(BaseModel):
    """Complete user profile model"""
    id: str
    name: str
    email: Optional[str] = None
    age: int = Field(..., ge=1, le=120)
    height: float = Field(..., gt=0, description="Height in cm")
    weight: float = Field(..., gt=0, description="Weight in kg")
    gender: str = Field(..., description="Gender identity")
    activity_level: str = Field(..., description="Activity level: sedentary, light, moderate, active, very_active")
    goal: str = Field(..., description="Primary goal: weight_loss, muscle_gain, maintenance, health_improvement")
    target_weight: Optional[float] = None
    
    # Diet Preferences
    diet_type: str = Field(..., description="Diet type: vegetarian, non_vegetarian, vegan, eggetarian, pescatarian")
    restrictions: List[str] = Field(default_factory=list)
    allergies: List[str] = Field(default_factory=list)
    favorite_foods: List[str] = Field(default_factory=list)
    disliked_foods: List[str] = Field(default_factory=list)
    
    # Health
    health_conditions: List[str] = Field(default_factory=list)
    
    # Budget & Region
    daily_budget: Optional[float] = None
    weekly_budget: Optional[float] = None
    currency: str = "USD"
    region: str = Field(..., description="User's region for geo-personalization")
    preferred_cuisines: List[str] = Field(default_factory=list)
    
    # Tracking stats
    current_streak: int = 0
    longest_streak: int = 0
    total_days_tracked: int = 0
    joined_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Calculated fields
    bmr: Optional[float] = None
    tdee: Optional[float] = None
    daily_calorie_target: Optional[float] = None
    macro_targets: Optional[MacroTargets] = None


class UserCreate(BaseModel):
    """Request model for creating a user"""
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
    restrictions: List[str] = []
    allergies: List[str] = []
    health_conditions: List[str] = []
    daily_budget: Optional[float] = None
    weekly_budget: Optional[float] = None
    currency: str = "USD"
    region: str
    preferred_cuisines: List[str] = []


class UserUpdate(BaseModel):
    """Request model for updating user profile"""
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


