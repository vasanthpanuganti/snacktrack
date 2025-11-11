from fastapi import FastAPI

from app.api.routes import profiles, recommendations, recipes


def create_application() -> FastAPI:
    application = FastAPI(
        title="DietFriend API",
        version="0.1.0",
        description=(
            "DietFriend delivers personalized nutrition recommendations "
            "powered by user preferences, health data, and regional insights."
        ),
    )

    application.include_router(profiles.router, prefix="/api/v1/profiles", tags=["profiles"])
    application.include_router(
        recommendations.router,
        prefix="/api/v1/recommendations",
        tags=["recommendations"],
    )
    application.include_router(recipes.router, prefix="/api/v1/recipes", tags=["recipes"])

    return application


app = create_application()
