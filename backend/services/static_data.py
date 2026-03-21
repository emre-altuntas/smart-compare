import json
from pathlib import Path


DATA_DIR = Path(__file__).parent.parent / "data"

FOOTBALL_PLAYER_STATS = [
    {"key": "goals", "label": "Goals"},
    {"key": "assists", "label": "Assists"},
    {"key": "appearances", "label": "Appearances"},
    {"key": "ballon_dor_wins", "label": "Ballon d'Or"},
    {"key": "hat_tricks", "label": "Hat-Tricks"},
    {"key": "trophies", "label": "Trophies"},
]

FOOTBALL_TEAM_STATS = [
    {"key": "league_titles", "label": "League Titles"},
    {"key": "champions_league_titles", "label": "Champions League"},
    {"key": "domestic_cups", "label": "Domestic Cups"},
    {"key": "all_time_wins", "label": "All-Time Wins"},
]

BASKETBALL_STATS = [
    {"key": "points_per_game", "label": "Points Per Game"},
    {"key": "total_points", "label": "Total Points"},
    {"key": "rebounds", "label": "Rebounds"},
    {"key": "assists", "label": "Assists"},
    {"key": "championships", "label": "Championships"},
    {"key": "mvps", "label": "MVPs"},
    {"key": "all_star_selections", "label": "All-Star Selections"},
]


def _load_json(filename: str):
    with open(DATA_DIR / filename, "r", encoding="utf-8") as file:
        return json.load(file)


def _find_by_slug(entries, slug: str):
    return next((entry for entry in entries if entry["slug"] == slug), None)


def get_football_player(slug: str):
    return _find_by_slug(_load_json("football_players.json"), slug)


def get_football_team(slug: str):
    return _find_by_slug(_load_json("football_teams.json"), slug)


def get_basketball_athlete(slug: str):
    return _find_by_slug(_load_json("basketball.json"), slug)
