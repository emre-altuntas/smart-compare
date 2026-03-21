from fastapi import APIRouter, HTTPException, Query

from services.f1 import list_f1_athletes
from services.static_data import (
    get_basketball_athletes,
    get_football_players,
    get_football_teams,
)


router = APIRouter(prefix="/api", tags=["search"])


def _match_entries(entries: list[dict], query: str):
    normalized_query = query.strip().lower()
    matches = []
    for entry in entries:
        haystack = f"{entry['slug']} {entry['name']}".lower()
        if not normalized_query or normalized_query in haystack:
            matches.append({"slug": entry["slug"], "name": entry["name"]})
    return matches[:10]


def _get_athlete_entries(sport: str):
    if sport == "f1":
        return list_f1_athletes()
    if sport == "football":
        return get_football_players()
    if sport == "basketball":
        return get_basketball_athletes()
    raise HTTPException(status_code=400, detail=f"Unsupported sport '{sport}'.")


@router.get("/athletes")
async def search_athletes(
    sport: str = Query(..., description="Sport identifier"),
    q: str = Query("", description="Search query"),
):
    return {"results": _match_entries(_get_athlete_entries(sport), q)}


@router.get("/teams")
async def search_teams(
    sport: str = Query(..., description="Sport identifier"),
    q: str = Query("", description="Search query"),
):
    if sport != "football":
        raise HTTPException(status_code=400, detail="Only football teams are supported.")

    return {"results": _match_entries(get_football_teams(), q)}
