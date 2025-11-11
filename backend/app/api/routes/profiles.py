from typing import List

from fastapi import APIRouter

from app.schemas.profiles import ProfileCreate, ProfileResponse

router = APIRouter()


@router.post("/", response_model=ProfileResponse, summary="Create a new user profile")
def create_profile(profile: ProfileCreate) -> ProfileResponse:
    """Create a profile placeholder for future persistence integration."""
    return ProfileResponse(id="demo-user", **profile.model_dump())


@router.get("/", response_model=List[ProfileResponse], summary="List user profiles")
def list_profiles() -> List[ProfileResponse]:
    """Return sample profiles to illustrate the API contract."""
    sample_profile = ProfileResponse(
        id="demo-user",
        age=30,
        weight=70.0,
        gender="female",
        activity_level="moderate",
        goal="weight_loss",
        preferred_cuisines=["mediterranean"],
        allergies=["peanuts"],
        dietary_restrictions=["vegetarian"],
        health_conditions=["hypertension"],
        region="Southern Europe",
    )
    return [sample_profile]
