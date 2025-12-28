from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import profiles, recommendations, recipes, meals, progress, leaderboard, admin


def create_application() -> FastAPI:
    application = FastAPI(
        title="SnackTrack API",
        version="1.0.0",
        description=(
            "SnackTrack delivers personalized, affordable, and health-aware meal planning "
            "powered by user preferences, health data, budget constraints, and regional insights."
        ),
    )
    
    # CORS middleware for frontend
    application.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include routers
    application.include_router(profiles.router, prefix="/api/v1/profiles", tags=["profiles"])
    application.include_router(
        recommendations.router,
        prefix="/api/v1/recommendations",
        tags=["recommendations"],
    )
    application.include_router(recipes.router, prefix="/api/v1/recipes", tags=["recipes"])
    application.include_router(meals.router, prefix="/api/v1/meals", tags=["meals"])
    application.include_router(progress.router, prefix="/api/v1/progress", tags=["progress"])
    application.include_router(leaderboard.router, prefix="/api/v1/leaderboard", tags=["leaderboard"])
    application.include_router(admin.router, prefix="/api/v1/admin", tags=["admin"])
    
    @application.get("/", tags=["health"])
    async def root():
        return {"status": "healthy", "service": "SnackTrack API", "version": "1.0.0"}
    
    @application.get("/health", tags=["health"])
    async def health_check():
        return {"status": "ok"}

    return application


app = create_application()
