from fastapi import APIRouter, HTTPException, Query
from services.f1 import get_f1_athlete
import asyncio

router = APIRouter(prefix="/api/compare", tags=["compare"])

@router.get("/athletes")
async def compare_athletes(
    sport: str = Query(..., description="Sport identifier"),
    a: str = Query(..., description="First athlete slug"),
    b: str = Query(..., description="Second athlete slug"),
    same_age: bool = Query(False, description="Whether to limit stats to younger age")
):
    if sport != "f1":
        raise HTTPException(status_code=400, detail="Only 'f1' sport is supported currently.")
        
    # We will fetch both athletes concurrently
    athlete_a, athlete_b = await asyncio.gather(
        get_f1_athlete(a),
        get_f1_athlete(b)
    )
    
    if not athlete_a or not athlete_b:
        raise HTTPException(status_code=404, detail="One or both athletes not found")
        
    return {
        "a": athlete_a,
        "b": athlete_b
    }
