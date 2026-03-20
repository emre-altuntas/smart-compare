# SMART COMPARE WEB APP

## Business Requirements

This project is building a smart compare web app. Key features:

- A user can choose a category such as sports to compare teams and famous athletes related to the chosen sport.
- Stats should cover the most important metrics — for F1: podiums, poles, wins, fastest laps, championships, and total points.
- If one athlete leads in certain stats (e.g. podiums and poles), those winning stats should appear visually prominent, while the stats they trail in should appear faded.
- The UI should support both Morning and Night modes, with a simple user toggle and consistent brand styling in both modes.

## Default Data Strategy

- On first load, use curated hardcoded local JSON data so the app works out of the box.
- Default comparisons to pre-load:
  - F1: Max Verstappen, Lewis Hamilton, Michael Schumacher
  - Football: Real Madrid vs Barcelona (club), Lionel Messi vs Cristiano Ronaldo (player)
  - Basketball: LeBron James vs Michael Jordan
- Keep data local in JSON files under backend for reliability and offline-first local development.
- No live sports API dependency is required for current scope.

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
- uv (package manager)

### No Docker, No Auth, No Database
- Runs fully local: `uvicorn` for backend, `vite dev` for frontend
- Data cached as JSON files in `backend/cache/`

## Starting Point

- A working MVP of the frontend has been built and is already in frontend. This is not yet designed for the Docker setup. It's a pure frontend-only demo.

## Color Scheme

-Blue Primary:       #209dd7   → navigation, links, card border
-Purple Secondary:   #753991   → CTA buttons
-Morning Sky:        #eef7fc   → morning page background
-Morning Card:       #ffffff   → morning card surface
-Night Background:   #0b1624   → night page background
-Night Surface:      #152334   → night cards and inputs
-Night Border:       #4a5f77   → night borders/dividers
-Night Text:         #dbe4ee   → comfortable night text (not pure white)
-Night Winner:       #7fc8ff   → winner highlight in night mode (no yellow)
-Morning Winner:     #ecad0a   → winner highlight in morning mode
-Muted Gray:         #888888   → label, secondary text

## Coding standards

1. Use latest versions of libraries and idiomatic approaches as of today
2. Keep it simple - NEVER over-engineer, ALWAYS simplify, NO unnecessary defensive programming. No extra features - focus on simplicity.
3. Be concise. Keep README minimal. IMPORTANT: no emojis ever
4. When hitting issues, always identify root cause before trying a fix. Do not guess. Prove with evidence, then fix the root cause.

## Working documentation

All documents for planning and executing this project will be in the docs/ directory.
Please review the docs/PLAN.md document before proceeding.