import asyncio

from fastapi import APIRouter, HTTPException, Query

from services.f1 import F1_STATS, get_f1_athlete
from services.static_data import (
    BASKETBALL_STATS,
    FOOTBALL_PLAYER_STATS,
    FOOTBALL_TEAM_STATS,
    get_basketball_athlete,
    get_football_player,
    get_football_team,
)

router = APIRouter(prefix="/api/compare", tags=["compare"])


def _build_entry(slug: str, name: str, values: dict, extra: dict | None = None):
    payload = {
        "slug": slug,
        "name": name,
        "values": values,
    }
    if extra:
        payload.update(extra)
    return payload


def _build_response(sport: str, entity_type: str, stats: list[dict], entry_a: dict, entry_b: dict):
    return {
        "sport": sport,
        "entity_type": entity_type,
        "stats": stats,
        "a": entry_a,
        "b": entry_b,
    }


@router.get("/athletes")
async def compare_athletes(
    sport: str = Query(..., description="Sport identifier"),
    a: str = Query(..., description="First athlete slug"),
    b: str = Query(..., description="Second athlete slug"),
    same_age: bool = Query(False, description="Whether to limit stats to younger age"),
):
    if same_age:
        raise HTTPException(status_code=400, detail="same_age comparison is not supported.")

    if sport == "f1":
        athlete_a, athlete_b = await asyncio.gather(get_f1_athlete(a), get_f1_athlete(b))
        stats = F1_STATS
    elif sport == "football":
        athlete_a, athlete_b = await asyncio.gather(
            asyncio.to_thread(get_football_player, a),
            asyncio.to_thread(get_football_player, b),
        )
        stats = FOOTBALL_PLAYER_STATS
    elif sport == "basketball":
        athlete_a, athlete_b = await asyncio.gather(
            asyncio.to_thread(get_basketball_athlete, a),
            asyncio.to_thread(get_basketball_athlete, b),
        )
        stats = BASKETBALL_STATS
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported sport '{sport}'.")

    if not athlete_a or not athlete_b:
        raise HTTPException(status_code=404, detail="One or both athletes not found")

    if sport == "basketball":
        entry_a = _build_entry(
            a,
            athlete_a["name"],
            athlete_a["career"],
            {"seasons": athlete_a["seasons"]},
        )
        entry_b = _build_entry(
            b,
            athlete_b["name"],
            athlete_b["career"],
            {"seasons": athlete_b["seasons"]},
        )
    elif sport == "football":
        entry_a = _build_entry(a, athlete_a["name"], athlete_a["stats"])
        entry_b = _build_entry(b, athlete_b["name"], athlete_b["stats"])
    else:
        f1_values_a = {key: value for key, value in athlete_a.items() if key not in {"name", "birth_date"}}
        f1_values_b = {key: value for key, value in athlete_b.items() if key not in {"name", "birth_date"}}
        entry_a = _build_entry(a, athlete_a["name"], f1_values_a, {"birth_date": athlete_a.get("birth_date")})
        entry_b = _build_entry(b, athlete_b["name"], f1_values_b, {"birth_date": athlete_b.get("birth_date")})

    return _build_response(sport, "athletes", stats, entry_a, entry_b)


@router.get("/teams")
async def compare_teams(
    sport: str = Query(..., description="Sport identifier"),
    a: str = Query(..., description="First team slug"),
    b: str = Query(..., description="Second team slug"),
):
    if sport != "football":
        raise HTTPException(status_code=400, detail="Only football team comparisons are supported.")

    team_a, team_b = await asyncio.gather(
        asyncio.to_thread(get_football_team, a),
        asyncio.to_thread(get_football_team, b),
    )

    if not team_a or not team_b:
        raise HTTPException(status_code=404, detail="One or both teams not found")

    entry_a = _build_entry(a, team_a["name"], team_a["stats"])
    entry_b = _build_entry(b, team_b["name"], team_b["stats"])

    return _build_response("football", "teams", FOOTBALL_TEAM_STATS, entry_a, entry_b)
