from typing import List

from fastapi import APIRouter

from app.schemas.recipes import RecipeResponse

router = APIRouter()


@router.get("/regional", response_model=List[RecipeResponse], summary="Regional recipe ideas")
def regional_recipes(region: str = "Southern Europe") -> List[RecipeResponse]:
    """Return placeholder recipes tailored to a requested region."""
    return [
        RecipeResponse(
            id="gazpacho",
            title="Chilled Gazpacho",
            cuisine="spanish",
            calories=150,
            macros={"protein": 4, "carbs": 20, "fat": 6},
            ingredients=["tomatoes", "cucumber", "bell pepper"],
            instructions="Blend vegetables with olive oil and chill.",
            region=region,
        ),
        RecipeResponse(
            id="herb-quinoa",
            title="Herb-Infused Quinoa Bowl",
            cuisine="mediterranean",
            calories=420,
            macros={"protein": 18, "carbs": 55, "fat": 12},
            ingredients=["quinoa", "olive oil", "parsley", "feta"],
            instructions="Simmer quinoa and toss with herbs and feta.",
            region=region,
        ),
    ]
