from typing import List, Optional
from datetime import date, datetime, timedelta
from fastapi import APIRouter, Query
from pydantic import BaseModel, Field

router = APIRouter()


class WeightEntry(BaseModel):
    """Weight log entry"""
    date: date
    weight: float


class WeeklyStats(BaseModel):
    """Weekly statistics"""
    week: str
    avg_calories: int
    avg_protein: float
    adherence: float
    weight_change: Optional[float] = None


class Achievement(BaseModel):
    """User achievement"""
    id: str
    title: str
    description: str
    icon: str
    unlocked_at: Optional[datetime] = None
    progress: Optional[int] = None
    target: Optional[int] = None


class ProgressSummary(BaseModel):
    """Complete progress summary"""
    current_weight: float
    starting_weight: float
    target_weight: float
    weight_change: float
    progress_to_goal: float
    current_streak: int
    longest_streak: int
    total_days_tracked: int
    avg_daily_calories: int
    avg_adherence: float


class ProgressHistory(BaseModel):
    """Historical progress data"""
    weight_history: List[WeightEntry]
    weekly_stats: List[WeeklyStats]
    achievements: List[Achievement]


@router.get("/summary", response_model=ProgressSummary, summary="Get progress summary")
async def get_progress_summary(user_id: str = Query(default="demo-user")):
    """Get overall progress summary for the user"""
    return ProgressSummary(
        current_weight=72.5,
        starting_weight=75.0,
        target_weight=70.0,
        weight_change=-2.5,
        progress_to_goal=50.0,
        current_streak=18,
        longest_streak=45,
        total_days_tracked=128,
        avg_daily_calories=1850,
        avg_adherence=87.5
    )


@router.get("/weight-history", response_model=List[WeightEntry], summary="Get weight history")
async def get_weight_history(
    user_id: str = Query(default="demo-user"),
    weeks: int = Query(default=8, ge=1, le=52)
):
    """Get weight history for the past N weeks"""
    today = date.today()
    history = []
    
    # Generate sample weight data
    weights = [75.0, 74.5, 74.2, 73.8, 73.5, 73.2, 72.8, 72.5]
    for i, weight in enumerate(weights[:weeks]):
        history.append(WeightEntry(
            date=today - timedelta(weeks=weeks-i-1),
            weight=weight
        ))
    
    return history


@router.post("/weight", summary="Log weight")
async def log_weight(
    weight: float = Query(..., gt=0, lt=500),
    user_id: str = Query(default="demo-user")
):
    """Log current weight"""
    return {
        "date": date.today().isoformat(),
        "weight": weight,
        "message": "Weight logged successfully"
    }


@router.get("/weekly-stats", response_model=List[WeeklyStats], summary="Get weekly statistics")
async def get_weekly_stats(
    user_id: str = Query(default="demo-user"),
    weeks: int = Query(default=8, ge=1, le=52)
):
    """Get weekly nutrition and adherence statistics"""
    stats = []
    
    sample_data = [
        {"calories": 1850, "protein": 95, "adherence": 85},
        {"calories": 1920, "protein": 98, "adherence": 90},
        {"calories": 1780, "protein": 88, "adherence": 78},
        {"calories": 1900, "protein": 96, "adherence": 92},
        {"calories": 1880, "protein": 94, "adherence": 88},
        {"calories": 1950, "protein": 100, "adherence": 95},
        {"calories": 1820, "protein": 92, "adherence": 91},
        {"calories": 1870, "protein": 95, "adherence": 94},
    ]
    
    for i, data in enumerate(sample_data[:weeks]):
        stats.append(WeeklyStats(
            week=f"W{i+1}",
            avg_calories=data["calories"],
            avg_protein=data["protein"],
            adherence=data["adherence"],
            weight_change=-0.3 if i > 0 else None
        ))
    
    return stats


@router.get("/achievements", response_model=List[Achievement], summary="Get achievements")
async def get_achievements(user_id: str = Query(default="demo-user")):
    """Get user achievements"""
    return [
        Achievement(
            id="first_week",
            title="First Week",
            description="Complete your first week of tracking",
            icon="🌟",
            unlocked_at=datetime.now() - timedelta(days=100)
        ),
        Achievement(
            id="7_day_streak",
            title="7-Day Streak",
            description="Maintain a 7-day tracking streak",
            icon="🔥",
            unlocked_at=datetime.now() - timedelta(days=80)
        ),
        Achievement(
            id="protein_pro",
            title="Protein Pro",
            description="Hit protein goals 7 days in a row",
            icon="💪",
            unlocked_at=datetime.now() - timedelta(days=50)
        ),
        Achievement(
            id="hydration_hero",
            title="Hydration Hero",
            description="Drink 8 glasses of water 5 days straight",
            icon="💧",
            unlocked_at=datetime.now() - timedelta(days=30)
        ),
        Achievement(
            id="30_day_streak",
            title="30-Day Streak",
            description="Maintain a 30-day tracking streak",
            icon="🏆",
            unlocked_at=None,
            progress=18,
            target=30
        ),
        Achievement(
            id="recipe_master",
            title="Recipe Master",
            description="Try 20 different recipes",
            icon="👨‍🍳",
            unlocked_at=None,
            progress=12,
            target=20
        ),
    ]


@router.get("/streaks", summary="Get streak information")
async def get_streaks(user_id: str = Query(default="demo-user")):
    """Get current and historical streak information"""
    return {
        "current_streak": 18,
        "longest_streak": 45,
        "streak_history": [
            {"start_date": "2024-10-01", "end_date": "2024-11-15", "length": 45},
            {"start_date": "2024-12-07", "end_date": None, "length": 18}
        ]
    }


