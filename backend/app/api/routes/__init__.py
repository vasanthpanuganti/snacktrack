"""API route modules for SnackTrack"""

from app.api.routes import (
    auth,
    profiles,
    recommendations,
    recipes,
    meals,
    foods,
    progress,
    leaderboard,
    admin,
)

__all__ = [
    "auth",
    "profiles",
    "recommendations",
    "recipes",
    "meals",
    "foods",
    "progress",
    "leaderboard",
    "admin",
]

