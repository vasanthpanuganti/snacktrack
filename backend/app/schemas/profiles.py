from typing import List, Optional

from pydantic import BaseModel, Field


class ProfileBase(BaseModel):
    age: int = Field(..., ge=1, le=120)
    weight: float = Field(..., gt=0)
    gender: str = Field(..., description="Gender identity for personalization")
    activity_level: str = Field(..., description="Workout or daily activity level")
    goal: str = Field(..., description="Primary wellness goal")
    preferred_cuisines: List[str] = Field(default_factory=list)
    allergies: List[str] = Field(default_factory=list)
    dietary_restrictions: List[str] = Field(default_factory=list)
    health_conditions: List[str] = Field(default_factory=list)
    region: str = Field(..., description="User's region for geo-personalization")


class ProfileCreate(ProfileBase):
    pass


class ProfileResponse(ProfileBase):
    id: str


class ProfileUpdate(ProfileBase):
    age: Optional[int] = None
    weight: Optional[float] = None
