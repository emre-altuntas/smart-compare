import httpx
import asyncio
import json
import os
import time
from pathlib import Path

# Provide a mapping for common short slugs to Ergast driver IDs
slug_mapping = {
    "verstappen": "max_verstappen",
    "hamilton": "hamilton",
    "schumacher": "michael_schumacher",
}

CACHE_DIR = Path(__file__).parent.parent / "cache"

async def fetch_count(client, url):
    try:
        resp = await client.get(url)
        if resp.status_code == 200:
            data = resp.json()
            return int(data.get('MRData', {}).get('total', 0))
    except Exception:
        pass
    return 0

async def fetch_f1_data(slug):
    driver_id = slug_mapping.get(slug, slug)
    
    async with httpx.AsyncClient(base_url="http://api.jolpi.ca/ergast/f1", follow_redirects=True, timeout=10.0) as client:
        # Get driver info
        resp = await client.get(f"/drivers/{driver_id}.json")
        if resp.status_code != 200:
            return None
        
        driver_data = resp.json().get('MRData', {}).get('DriverTable', {}).get('Drivers', [])
        if not driver_data:
            return None
            
        driver_info = driver_data[0]
        name = f"{driver_info.get('givenName')} {driver_info.get('familyName')}"
        birth_date = driver_info.get('dateOfBirth')
        
        # We need to run these concurrently to save time
        tasks = [
            fetch_count(client, f"/drivers/{driver_id}/results/1.json?limit=1"),
            fetch_count(client, f"/drivers/{driver_id}/results/2.json?limit=1"),
            fetch_count(client, f"/drivers/{driver_id}/results/3.json?limit=1"),
            fetch_count(client, f"/drivers/{driver_id}/qualifying/1.json?limit=1"),
            fetch_count(client, f"/drivers/{driver_id}/fastest/1/results.json?limit=1"),
            fetch_count(client, f"/drivers/{driver_id}/driverStandings/1.json?limit=1"),
            client.get(f"/drivers/{driver_id}/driverStandings.json?limit=100")
        ]
        
        results = await asyncio.gather(*tasks)
        wins, p2, p3, poles, fastest_laps, championships, standings_resp = results
        podiums = wins + p2 + p3
        
        total_points = 0.0
        if standings_resp.status_code == 200:
            s_data = standings_resp.json()
            lists = s_data.get('MRData', {}).get('StandingsTable', {}).get('StandingsLists', [])
            for s in lists:
                driver_standings = s.get('DriverStandings', [])
                if driver_standings:
                    total_points += float(driver_standings[0].get('points', 0))
                    
        return {
            "name": name,
            "birth_date": birth_date,
            "wins": wins,
            "podiums": podiums,
            "poles": poles,
            "fastest_laps": fastest_laps,
            "championships": championships,
            "total_points": total_points
        }

async def get_f1_athlete(slug):
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    cache_file = CACHE_DIR / f"{slug}.json"
    
    # Check if cache exists and is younger than 7 days
    if cache_file.exists():
        mtime = os.path.getmtime(cache_file)
        if (time.time() - mtime) < 7 * 24 * 3600:
            try:
                with open(cache_file, "r") as f:
                    return json.load(f)
            except Exception:
                pass # Fallback to fetch
                
    # Fetch
    data = await fetch_f1_data(slug)
    if data:
        with open(cache_file, "w") as f:
            json.dump(data, f)
            
    return data
