from typing import List, Optional
from datetime import datetime, timedelta
from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel

router = APIRouter()


class AdminStats(BaseModel):
    """Platform statistics for admin dashboard"""
    total_users: int
    active_users: int
    new_users_today: int
    new_users_week: int
    total_recipes: int
    published_recipes: int
    meal_plans_generated: int
    average_adherence: float


class UserSummary(BaseModel):
    """Summary of a user for admin view"""
    id: str
    name: str
    email: str
    joined_at: datetime
    status: str
    streak: int
    adherence: float


class RecipeSummary(BaseModel):
    """Summary of a recipe for admin view"""
    id: str
    title: str
    cuisine: str
    calories: int
    status: str
    views: int
    rating: float


class TagCategory(BaseModel):
    """A category of tags"""
    category: str
    tags: List[str]


@router.get("/stats", response_model=AdminStats, summary="Get platform statistics")
async def get_admin_stats():
    """Get overall platform statistics"""
    return AdminStats(
        total_users=12847,
        active_users=8923,
        new_users_today=47,
        new_users_week=312,
        total_recipes=456,
        published_recipes=423,
        meal_plans_generated=34521,
        average_adherence=87.5
    )


@router.get("/users", response_model=List[UserSummary], summary="List all users")
async def list_users(
    status: Optional[str] = Query(None, description="Filter by status: active, inactive"),
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0)
):
    """List all users with optional filtering"""
    sample_users = [
        UserSummary(
            id="user_1", name="Emma Wilson", email="emma@example.com",
            joined_at=datetime.now() - timedelta(days=120),
            status="active", streak=45, adherence=98
        ),
        UserSummary(
            id="user_2", name="James Chen", email="james@example.com",
            joined_at=datetime.now() - timedelta(days=90),
            status="active", streak=38, adherence=95
        ),
        UserSummary(
            id="user_3", name="Sofia Rodriguez", email="sofia@example.com",
            joined_at=datetime.now() - timedelta(days=60),
            status="active", streak=42, adherence=92
        ),
        UserSummary(
            id="user_4", name="Alex Thompson", email="alex@example.com",
            joined_at=datetime.now() - timedelta(days=30),
            status="inactive", streak=0, adherence=75
        ),
        UserSummary(
            id="user_5", name="Priya Patel", email="priya@example.com",
            joined_at=datetime.now() - timedelta(days=15),
            status="active", streak=15, adherence=88
        ),
    ]
    
    if status:
        sample_users = [u for u in sample_users if u.status == status]
    
    return sample_users[offset:offset+limit]


@router.get("/users/{user_id}", summary="Get user details")
async def get_user_details(user_id: str):
    """Get detailed information about a specific user"""
    return {
        "id": user_id,
        "name": "Demo User",
        "email": "demo@example.com",
        "joined_at": datetime.now() - timedelta(days=100),
        "status": "active",
        "profile": {
            "age": 30,
            "weight": 72.5,
            "goal": "weight_loss",
            "diet_type": "vegetarian"
        },
        "stats": {
            "current_streak": 18,
            "longest_streak": 45,
            "total_days_tracked": 128,
            "average_adherence": 87.5
        }
    }


@router.put("/users/{user_id}/status", summary="Update user status")
async def update_user_status(user_id: str, status: str = Query(..., description="active, inactive, suspended")):
    """Update a user's status"""
    if status not in ["active", "inactive", "suspended"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    return {"user_id": user_id, "status": status, "message": "Status updated successfully"}


@router.get("/recipes", response_model=List[RecipeSummary], summary="List all recipes")
async def list_recipes(
    status: Optional[str] = Query(None, description="Filter by status: published, draft, archived"),
    cuisine: Optional[str] = Query(None),
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0)
):
    """List all recipes with optional filtering"""
    sample_recipes = [
        RecipeSummary(
            id="recipe_1", title="Mediterranean Quinoa Bowl", cuisine="Mediterranean",
            calories=420, status="published", views=1234, rating=4.8
        ),
        RecipeSummary(
            id="recipe_2", title="Grilled Salmon", cuisine="American",
            calories=520, status="published", views=987, rating=4.9
        ),
        RecipeSummary(
            id="recipe_3", title="Chicken Tikka Masala", cuisine="Indian",
            calories=480, status="published", views=2341, rating=4.7
        ),
        RecipeSummary(
            id="recipe_4", title="Thai Green Curry", cuisine="Thai",
            calories=450, status="draft", views=0, rating=0
        ),
        RecipeSummary(
            id="recipe_5", title="Greek Salad", cuisine="Greek",
            calories=280, status="published", views=756, rating=4.5
        ),
    ]
    
    if status:
        sample_recipes = [r for r in sample_recipes if r.status == status]
    if cuisine:
        sample_recipes = [r for r in sample_recipes if r.cuisine.lower() == cuisine.lower()]
    
    return sample_recipes[offset:offset+limit]


@router.put("/recipes/{recipe_id}/status", summary="Update recipe status")
async def update_recipe_status(recipe_id: str, status: str = Query(..., description="published, draft, archived")):
    """Update a recipe's status"""
    if status not in ["published", "draft", "archived"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    return {"recipe_id": recipe_id, "status": status, "message": "Recipe status updated"}


@router.get("/tags", response_model=List[TagCategory], summary="Get all tags")
async def get_all_tags():
    """Get all tags organized by category"""
    return [
        TagCategory(
            category="cuisines",
            tags=["Mediterranean", "Indian", "Thai", "American", "Japanese", "Chinese", "Greek", "Mexican", "Italian", "Korean"]
        ),
        TagCategory(
            category="diet_types",
            tags=["Vegetarian", "Vegan", "Keto", "Gluten-Free", "Low-Calorie", "High-Protein", "Low-Carb", "Paleo"]
        ),
        TagCategory(
            category="meal_types",
            tags=["Breakfast", "Lunch", "Dinner", "Snack", "Dessert", "Beverage"]
        ),
        TagCategory(
            category="health_conditions",
            tags=["Diabetes-Friendly", "Heart-Healthy", "Low-Sodium", "PCOS-Friendly", "Anti-Inflammatory"]
        ),
        TagCategory(
            category="allergens",
            tags=["Nut-Free", "Dairy-Free", "Gluten-Free", "Soy-Free", "Egg-Free", "Shellfish-Free"]
        ),
    ]


@router.post("/tags/{category}", summary="Add a new tag")
async def add_tag(category: str, tag: str = Query(...)):
    """Add a new tag to a category"""
    return {"category": category, "tag": tag, "message": "Tag added successfully"}


@router.delete("/tags/{category}/{tag}", summary="Delete a tag")
async def delete_tag(category: str, tag: str):
    """Delete a tag from a category"""
    return {"category": category, "tag": tag, "message": "Tag deleted successfully"}


@router.get("/reports/usage", summary="Get usage report")
async def get_usage_report(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None)
):
    """Get platform usage report"""
    return {
        "period": {"start": start_date, "end": end_date},
        "metrics": {
            "daily_active_users": [
                {"date": "2024-12-19", "count": 8234},
                {"date": "2024-12-20", "count": 8456},
                {"date": "2024-12-21", "count": 7823},
                {"date": "2024-12-22", "count": 8901},
                {"date": "2024-12-23", "count": 9123},
                {"date": "2024-12-24", "count": 8654},
                {"date": "2024-12-25", "count": 8923},
            ],
            "meals_logged_per_day": 24567,
            "recipes_viewed_per_day": 45678,
            "average_session_duration": "12m 34s",
            "most_popular_recipes": [
                {"id": "recipe_3", "title": "Chicken Tikka Masala", "views": 2341},
                {"id": "recipe_1", "title": "Mediterranean Quinoa Bowl", "views": 1234},
                {"id": "recipe_2", "title": "Grilled Salmon", "views": 987},
            ]
        }
    }


