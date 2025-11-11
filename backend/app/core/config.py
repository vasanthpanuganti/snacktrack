from functools import lru_cache
from typing import Optional

from pydantic import BaseSettings, Field


class Settings(BaseSettings):
    app_name: str = "DietFriend API"
    database_url: str = Field(
        "postgresql+asyncpg://dietfriend:password@localhost:5432/dietfriend",
        description="Connection string for PostgreSQL or alternative DB engine.",
    )
    spoonacular_api_key: Optional[str] = None
    openfoodfacts_base_url: str = "https://world.openfoodfacts.org"
    geocoding_api_key: Optional[str] = None

    class Config:
        env_file = ".env"


@lru_cache
def get_settings() -> Settings:
    return Settings()
