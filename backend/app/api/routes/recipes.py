from typing import List, Optional, Dict
from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel, Field
import logging

from app.services.spoonacular import spoonacular_service

logger = logging.getLogger(__name__)

router = APIRouter()


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


class RecipeCreate(BaseModel):
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


# Sample recipes database
SAMPLE_RECIPES = [
    RecipeResponse(
        id="recipe_1",
        title="Mediterranean Quinoa Bowl",
        description="A vibrant, nutritious bowl featuring fluffy quinoa, fresh Mediterranean vegetables, creamy feta cheese, and a zesty lemon herb dressing.",
        cuisine="Mediterranean",
        meal_type="lunch",
        prep_time=15,
        cook_time=20,
        servings=2,
        nutrition=NutritionInfo(calories=420, protein=18, carbs=52, fat=16, fiber=8),
        ingredients=[
            Ingredient(name="Quinoa", amount=1, unit="cup", calories=220),
            Ingredient(name="Cherry tomatoes", amount=1, unit="cup", calories=27),
            Ingredient(name="Cucumber", amount=1, unit="medium", calories=16),
            Ingredient(name="Feta cheese", amount=0.5, unit="cup", calories=99),
            Ingredient(name="Olive oil", amount=2, unit="tbsp", calories=239),
            Ingredient(name="Lemon juice", amount=2, unit="tbsp", calories=6),
        ],
        instructions=[
            "Rinse quinoa under cold water and cook with 2 cups water for 15 minutes.",
            "Dice cucumber and halve cherry tomatoes.",
            "Whisk together olive oil, lemon juice, and herbs for dressing.",
            "Combine quinoa with vegetables, drizzle with dressing.",
            "Top with crumbled feta and fresh parsley.",
        ],
        tags=["High Protein", "Vegetarian", "Gluten-Free", "Meal Prep Friendly"],
        region="Southern Europe",
        cost_per_serving=4.50,
        health_benefits=[
            "High in plant-based protein",
            "Rich in antioxidants",
            "Healthy fats support heart health",
            "Good source of fiber",
        ],
        suitable_for=["Diabetes", "Heart Health", "Weight Management"],
        rating=4.8,
        review_count=124,
    ),
    RecipeResponse(
        id="recipe_2",
        title="Grilled Salmon with Asparagus",
        description="Perfectly grilled salmon fillet with roasted asparagus and lemon butter sauce.",
        cuisine="American",
        meal_type="dinner",
        prep_time=10,
        cook_time=20,
        servings=2,
        nutrition=NutritionInfo(calories=520, protein=42, carbs=12, fat=32, fiber=4),
        ingredients=[
            Ingredient(name="Salmon fillet", amount=400, unit="g", calories=830),
            Ingredient(name="Asparagus", amount=200, unit="g", calories=40),
            Ingredient(name="Butter", amount=2, unit="tbsp", calories=204),
            Ingredient(name="Lemon", amount=1, unit="whole", calories=17),
            Ingredient(name="Garlic", amount=2, unit="cloves", calories=9),
        ],
        instructions=[
            "Preheat grill to medium-high heat.",
            "Season salmon with salt, pepper, and lemon juice.",
            "Grill salmon for 4-5 minutes per side.",
            "Roast asparagus with olive oil at 400°F for 10 minutes.",
            "Make lemon butter sauce with melted butter and lemon zest.",
            "Serve salmon over asparagus, drizzled with sauce.",
        ],
        tags=["High Protein", "Keto", "Omega-3", "Low Carb"],
        region="North America",
        cost_per_serving=8.50,
        health_benefits=[
            "Rich in Omega-3 fatty acids",
            "High quality protein",
            "Supports brain health",
            "Anti-inflammatory properties",
        ],
        suitable_for=["Heart Health", "Brain Health", "Weight Loss"],
        rating=4.9,
        review_count=89,
    ),
    RecipeResponse(
        id="recipe_3",
        title="Chicken Tikka Masala",
        description="Tender chicken in a creamy, aromatic tomato-based curry sauce with traditional Indian spices.",
        cuisine="Indian",
        meal_type="dinner",
        prep_time=20,
        cook_time=30,
        servings=4,
        nutrition=NutritionInfo(calories=480, protein=35, carbs=28, fat=24, fiber=4),
        ingredients=[
            Ingredient(name="Chicken breast", amount=500, unit="g", calories=825),
            Ingredient(name="Greek yogurt", amount=1, unit="cup", calories=100),
            Ingredient(name="Tomato puree", amount=400, unit="g", calories=80),
            Ingredient(name="Heavy cream", amount=0.5, unit="cup", calories=410),
            Ingredient(name="Garam masala", amount=2, unit="tsp", calories=10),
            Ingredient(name="Ginger-garlic paste", amount=2, unit="tbsp", calories=20),
        ],
        instructions=[
            "Marinate chicken in yogurt and spices for at least 1 hour.",
            "Grill or bake marinated chicken until charred.",
            "Sauté onions, ginger, and garlic in a large pan.",
            "Add tomato puree and simmer for 10 minutes.",
            "Add cream and garam masala, simmer for 5 minutes.",
            "Add cooked chicken to the sauce and simmer together.",
            "Garnish with cilantro and serve with rice or naan.",
        ],
        tags=["High Protein", "Spicy", "Comfort Food"],
        region="South Asia",
        cost_per_serving=5.00,
        health_benefits=[
            "High in protein",
            "Contains anti-inflammatory turmeric",
            "Good source of B vitamins",
        ],
        suitable_for=["High Protein Diet"],
        not_suitable_for=["Lactose Intolerance"],
        rating=4.7,
        review_count=156,
    ),
        RecipeResponse(
        id="recipe_4",
        title="Avocado Toast with Poached Eggs",
        description="Creamy avocado on toasted sourdough topped with perfectly poached eggs and a sprinkle of everything bagel seasoning.",
        cuisine="American",
        meal_type="breakfast",
        prep_time=5,
        cook_time=10,
        servings=2,
        nutrition=NutritionInfo(calories=380, protein=14, carbs=32, fat=22, fiber=7),
        ingredients=[
            Ingredient(name="Ripe avocado", amount=1, unit="large", calories=322),
            Ingredient(name="Eggs", amount=2, unit="large", calories=156),
            Ingredient(name="Sourdough bread", amount=2, unit="slices", calories=180),
            Ingredient(name="Lime juice", amount=1, unit="tbsp", calories=4),
            Ingredient(name="Everything bagel seasoning", amount=1, unit="tsp", calories=10),
        ],
        instructions=[
            "Toast sourdough bread until golden brown.",
            "Mash avocado with lime juice, salt, and pepper.",
            "Bring water to a gentle simmer for poaching eggs.",
            "Create a vortex and slide eggs in, cook for 3 minutes.",
            "Spread mashed avocado on toast.",
            "Top with poached eggs and seasoning.",
        ],
        tags=["Quick", "Vegetarian", "Breakfast", "High Fiber"],
        region="North America",
        cost_per_serving=3.50,
        health_benefits=[
            "Healthy monounsaturated fats",
            "High in fiber",
            "Good source of protein",
            "Contains potassium",
        ],
        suitable_for=["Heart Health", "Weight Management"],
        rating=4.6,
        review_count=203,
        ),
        RecipeResponse(
        id="recipe_5",
        title="Thai Green Curry",
        description="Fragrant green curry with coconut milk, vegetables, and your choice of protein.",
        cuisine="Thai",
        meal_type="dinner",
        prep_time=15,
        cook_time=25,
        servings=4,
        nutrition=NutritionInfo(calories=450, protein=28, carbs=24, fat=28, fiber=4),
        ingredients=[
            Ingredient(name="Green curry paste", amount=3, unit="tbsp", calories=30),
            Ingredient(name="Coconut milk", amount=400, unit="ml", calories=760),
            Ingredient(name="Chicken or tofu", amount=400, unit="g", calories=500),
            Ingredient(name="Thai basil", amount=1, unit="cup", calories=5),
            Ingredient(name="Bell peppers", amount=2, unit="medium", calories=50),
            Ingredient(name="Fish sauce", amount=2, unit="tbsp", calories=10),
        ],
        instructions=[
            "Heat curry paste in a wok until fragrant.",
            "Add coconut milk and bring to a simmer.",
            "Add protein and cook until done.",
            "Add vegetables and cook for 5 minutes.",
            "Season with fish sauce and palm sugar.",
            "Garnish with Thai basil and serve with jasmine rice.",
        ],
        tags=["Spicy", "Dairy-Free", "High Protein", "Gluten-Free"],
        region="Southeast Asia",
        cost_per_serving=4.50,
        health_benefits=[
            "Anti-inflammatory ingredients",
            "Contains healthy fats from coconut",
            "Rich in vitamins from vegetables",
        ],
        suitable_for=["Dairy-Free Diet", "High Protein Diet"],
        rating=4.8,
        review_count=98,
    ),
]


@router.get("/", response_model=List[RecipeResponse], summary="List all recipes")
async def list_recipes(
    cuisine: Optional[str] = Query(None, description="Filter by cuisine"),
    meal_type: Optional[str] = Query(None, description="Filter by meal type"),
    max_calories: Optional[int] = Query(None, description="Maximum calories per serving"),
    max_prep_time: Optional[int] = Query(None, description="Maximum prep time in minutes"),
    diet_type: Optional[str] = Query(None, description="Diet type filter"),
    exclude_allergens: Optional[str] = Query(None, description="Comma-separated allergens to exclude"),
    tags: Optional[str] = Query(None, description="Comma-separated tags to include"),
    search: Optional[str] = Query(None, description="Search query"),
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
) -> List[RecipeResponse]:
    """Get all recipes with optional filtering"""
    
    # Try to use Spoonacular API if configured
    if spoonacular_service.api_key:
        try:
            results = await spoonacular_service.search_recipes(
                query=search,
                cuisine=cuisine,
                diet=diet_type,
                exclude_ingredients=exclude_allergens,
                max_calories=max_calories,
                max_prep_time=max_prep_time,
                offset=offset,
                limit=limit,
            )
            
            # Filter by meal_type and tags if provided (Spoonacular doesn't support these directly)
            if meal_type:
                results = [r for r in results if r.meal_type.lower() == meal_type.lower()]
            
            if tags:
                tag_list = [t.strip().lower() for t in tags.split(",")]
                results = [
                    r for r in results
                    if any(t in [tag.lower() for tag in r.tags] for t in tag_list)
                ]
            
            return results
        except HTTPException:
            raise
        except Exception as e:
            logger.warning(f"Spoonacular API call failed, falling back to sample data: {e}")
    
    # Fallback to sample data
    results = SAMPLE_RECIPES.copy()
    
    if cuisine:
        results = [r for r in results if r.cuisine.lower() == cuisine.lower()]
    
    if meal_type:
        results = [r for r in results if r.meal_type.lower() == meal_type.lower()]
    
    if max_calories:
        results = [r for r in results if r.nutrition.calories <= max_calories]
    
    if max_prep_time:
        results = [r for r in results if r.prep_time <= max_prep_time]
    
    if tags:
        tag_list = [t.strip() for t in tags.split(",")]
        results = [r for r in results if any(t in r.tags for t in tag_list)]
    
    if search:
        search_lower = search.lower()
        results = [r for r in results if 
            search_lower in r.title.lower() or 
            search_lower in r.description.lower() or
            search_lower in r.cuisine.lower()
        ]
    
    return results[offset:offset+limit]


@router.get("/featured", response_model=List[RecipeResponse], summary="Get featured recipes")
async def get_featured_recipes(limit: int = Query(default=6, ge=1, le=20)) -> List[RecipeResponse]:
    """Get featured/popular recipes"""
    # Try Spoonacular API if configured
    if spoonacular_service.api_key:
        try:
            # Search for popular recipes (sorted by popularity/score)
            results = await spoonacular_service.search_recipes(
                limit=limit,
                offset=0,
            )
            # Sort by rating and return top recipes
            sorted_results = sorted(results, key=lambda r: r.rating, reverse=True)
            return sorted_results[:limit]
        except Exception as e:
            logger.warning(f"Spoonacular API call failed, falling back to sample data: {e}")
    
    # Fallback to sample data
    sorted_recipes = sorted(SAMPLE_RECIPES, key=lambda r: r.rating, reverse=True)
    return sorted_recipes[:limit]


@router.get("/regional", response_model=List[RecipeResponse], summary="Get regional recipes")
async def get_regional_recipes(
    region: str = Query(default="North America", description="User's region"),
    limit: int = Query(default=10, ge=1, le=50),
) -> List[RecipeResponse]:
    """Get recipes tailored to a specific region"""
    # Try Spoonacular API if configured
    # Map common regions to Spoonacular cuisines
    region_to_cuisine = {
        "North America": "American",
        "South America": "Latin American",
        "Europe": "European",
        "Asia": "Asian",
        "Middle East": "Middle Eastern",
        "Africa": "African",
    }
    cuisine = region_to_cuisine.get(region)
    
    if spoonacular_service.api_key and cuisine:
        try:
            return await spoonacular_service.search_recipes(
                cuisine=cuisine,
                limit=limit,
                offset=0,
            )
        except Exception as e:
            logger.warning(f"Spoonacular API call failed, falling back to sample data: {e}")
    
    # Fallback to sample data
    return SAMPLE_RECIPES[:limit]


@router.get("/by-health-condition", response_model=List[RecipeResponse], summary="Get recipes for health condition")
async def get_recipes_for_health_condition(
    condition: str = Query(..., description="Health condition to filter for"),
    limit: int = Query(default=10, ge=1, le=50),
) -> List[RecipeResponse]:
    """Get recipes suitable for a specific health condition"""
    results = [r for r in SAMPLE_RECIPES if condition in r.suitable_for]
    return results[:limit]


# NOTE: This route must come BEFORE /{recipe_id} to avoid being shadowed
@router.get("/{recipe_id}/alternatives", response_model=List[RecipeResponse], summary="Get recipe alternatives")
async def get_recipe_alternatives(
    recipe_id: str,
    limit: int = Query(default=3, ge=1, le=10),
) -> List[RecipeResponse]:
    """Get alternative recipes with similar nutrition profile"""
    # Try Spoonacular API if configured and recipe_id is numeric
    if spoonacular_service.api_key and recipe_id.isdigit():
        try:
            return await spoonacular_service.get_recipe_alternatives(
                recipe_id=int(recipe_id),
                limit=limit,
            )
        except HTTPException:
            raise
        except Exception as e:
            logger.warning(f"Spoonacular API call failed, falling back to sample data: {e}")
    
    # Fallback to sample data
    recipe = next((r for r in SAMPLE_RECIPES if r.id == recipe_id), None)
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    
    # Find recipes with similar calories (within 100 kcal)
    alternatives = [
        r for r in SAMPLE_RECIPES 
        if r.id != recipe_id and 
        abs(r.nutrition.calories - recipe.nutrition.calories) <= 100
    ]
    
    return alternatives[:limit]


@router.get("/{recipe_id}", response_model=RecipeResponse, summary="Get recipe by ID")
async def get_recipe(recipe_id: str) -> RecipeResponse:
    """Get a specific recipe by ID"""
    # Try Spoonacular API if configured and recipe_id is numeric
    if spoonacular_service.api_key and recipe_id.isdigit():
        try:
            return await spoonacular_service.get_recipe_by_id(int(recipe_id))
        except HTTPException:
            raise
        except Exception as e:
            logger.warning(f"Spoonacular API call failed, falling back to sample data: {e}")
    
    # Fallback to sample data
    recipe = next((r for r in SAMPLE_RECIPES if r.id == recipe_id), None)
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return recipe


@router.post("/", response_model=RecipeResponse, summary="Create a new recipe")
async def create_recipe(recipe: RecipeCreate) -> RecipeResponse:
    """Create a new recipe (admin only)"""
    new_recipe = RecipeResponse(
        id=f"recipe_{len(SAMPLE_RECIPES) + 1}",
        **recipe.model_dump(),
    )
    return new_recipe


@router.put("/{recipe_id}", response_model=RecipeResponse, summary="Update a recipe")
async def update_recipe(recipe_id: str, recipe: RecipeCreate) -> RecipeResponse:
    """Update an existing recipe (admin only)"""
    existing = next((r for r in SAMPLE_RECIPES if r.id == recipe_id), None)
    if not existing:
        raise HTTPException(status_code=404, detail="Recipe not found")
    
    return RecipeResponse(id=recipe_id, **recipe.model_dump())


@router.delete("/{recipe_id}", summary="Delete a recipe")
async def delete_recipe(recipe_id: str):
    """Delete a recipe (admin only)"""
    return {"message": f"Recipe {recipe_id} deleted successfully"}
