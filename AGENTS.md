# SMART COMPARE WEB APP

## Business Requirements

This project is building a smart compare web app. Key features:

- A user can choose a category such as sports to compare teams and famous athletes related to the chosen sport.
- When comparing athletes, there should be an option for "same-age stats": when selected, both athletes' stats are shown as of the younger athlete's current age.
- Stats should cover the most important metrics — for F1: podiums, poles, wins, fastest laps, championships, and total points.
- If one athlete leads in certain stats (e.g. podiums and poles), those winning stats should appear visually prominent, while the stats they trail in should appear faded.

## Default Data Strategy

- On first load, fetch real data from public APIs or scrape Wikipedia/stathead
  for a curated set of default entities so the app works out of the box.
- Default comparisons to pre-load:
  - F1: Max Verstappen, Lewis Hamilton, Michael Schumacher
  - Football: Real Madrid vs Barcelona (club), Lionel Messi vs Cristiano Ronaldo (player)
  - Basketball: LeBron James vs Michael Jordan
- Cache fetched data locally (JSON file in backend) to avoid repeat fetches.
- Data sources to research at build time: Ergast API (F1), FBref / Transfermarkt (football), Basketball-Reference (NBA).

## Limitations

- This will run locally.

### Frontend
- React 19 + Vite
- React Router v7 (client-side routing)
- TailwindCSS v4 (styling)
- Recharts (stat visualizations)

### Backend
- Python 3.13
- FastAPI (REST API)
- httpx (async HTTP calls)
- BeautifulSoup4 (scraping fallback)
- uv (package manager)

### No Docker, No Auth, No Database
- Runs fully local: `uvicorn` for backend, `vite dev` for frontend
- Data cached as JSON files in `backend/cache/`

## Starting Point

- A working MVP of the frontend has been built and is already in frontend. This is not yet designed for the Docker setup. It's a pure frontend-only demo.

## Color Scheme

-Accent Yellow: #ecad0a   → only "winner" stat highlight
-Winner Glow:   #ecad0a + opacity 100%
-Loser Fade:    same color with winner + opacity 35% (not gray, pale version)
-Blue Primary:  #209dd7   → navigation, links, card border
-Purple:        #753991   → CTA buttons (unchangeable)
-Dark Navy:     #032147   → heading, dark background
-Muted Gray:    #888888   → label, secondary text

## Coding standards

1. Use latest versions of libraries and idiomatic approaches as of today
2. Keep it simple - NEVER over-engineer, ALWAYS simplify, NO unnecessary defensive programming. No extra features - focus on simplicity.
3. Be concise. Keep README minimal. IMPORTANT: no emojis ever
4. When hitting issues, always identify root cause before trying a fix. Do not guess. Prove with evidence, then fix the root cause.

## Working documentation

All documents for planning and executing this project will be in the docs/ directory.
Please review the docs/PLAN.md document before proceeding.