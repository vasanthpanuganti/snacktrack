"""
Food Search and Nutrition API Routes

Endpoints for searching foods and retrieving nutrition data using USDA FoodData Central API.
"""

from typing import List, Optional
from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel

from app.services.usda import usda_service, FoodItem, FoodNutrition

router = APIRouter()


class FoodSearchResponse(BaseModel):
    """Response model for food search"""
    foods: List[FoodItem]
    total_hits: int
    current_page: int
    total_pages: int


@router.get("/search", response_model=FoodSearchResponse, summary="Search for foods")
async def search_foods(
    query: str = Query(..., description="Food name or search query", min_length=1),
    page_size: int = Query(default=20, ge=1, le=200, description="Number of results per page"),
    page_number: int = Query(default=1, ge=1, description="Page number"),
    data_type: Optional[str] = Query(
        None,
        description="Filter by data type (comma-separated: Branded,Foundation,SR Legacy)"
    ),
    brand_owner: Optional[str] = Query(None, description="Filter by brand owner"),
):
    """Search for foods using USDA FoodData Central API"""
    if not usda_service.api_key:
        raise HTTPException(
            status_code=503,
            detail="USDA API key not configured. Food search is not available."
        )
    
    # Parse data_type if provided
    data_type_list = None
    if data_type:
        data_type_list = [dt.strip() for dt in data_type.split(",")]
    
    try:
        result = await usda_service.search_foods(
            query=query,
            page_size=page_size,
            page_number=page_number,
            data_type=data_type_list,
            brand_owner=brand_owner,
        )
        return FoodSearchResponse(**result)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to search foods: {str(e)}")


@router.get("/{fdc_id}", response_model=FoodNutrition, summary="Get food nutrition by FDC ID")
async def get_food_nutrition(fdc_id: int):
    """Get detailed nutrition information for a specific food by FDC ID"""
    if not usda_service.api_key:
        raise HTTPException(
            status_code=503,
            detail="USDA API key not configured. Food nutrition lookup is not available."
        )
    
    try:
        return await usda_service.get_food_by_id(fdc_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch food nutrition: {str(e)}")


@router.post("/batch", response_model=List[FoodNutrition], summary="Get nutrition for multiple foods")
async def get_foods_batch(fdc_ids: List[int]):
    """Get detailed nutrition information for multiple foods by FDC IDs"""
    if not usda_service.api_key:
        raise HTTPException(
            status_code=503,
            detail="USDA API key not configured. Food nutrition lookup is not available."
        )
    
    if len(fdc_ids) > 20:
        raise HTTPException(status_code=400, detail="Maximum 20 food IDs per request")
    
    try:
        return await usda_service.get_foods_by_ids(fdc_ids)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch foods: {str(e)}")

