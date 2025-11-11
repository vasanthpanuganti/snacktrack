from typing import Dict, List

from pydantic import BaseModel


class RecipeResponse(BaseModel):
    id: str
    title: str
    cuisine: str
    calories: int
    macros: Dict[str, float]
    ingredients: List[str]
    instructions: str
    region: str
