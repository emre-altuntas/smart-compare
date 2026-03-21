# Smart Compare — Project Plan

---

## How to use this document

Each part below must be completed in order. After each part, the agent stops and waits
for user review before proceeding. The agent checks off each subtask as it completes it.

---

## Part 1: Review & Approval

Before writing any code, read `AGENTS.md` in full, then confirm the following with the user:

- [x] Tech stack is understood (React + Vite, FastAPI, uv, no Docker, no auth, no paid APIs)
- [x] Color scheme is noted
- [x] Default data entities are noted (Verstappen, Hamilton, Schumacher, Messi, Ronaldo, Real Madrid, Barcelona, LeBron, Jordan)
- [ ] User has reviewed and approved this PLAN.md

**Stop here. Do not proceed until the user explicitly says to continue.**

---

## Part 2: Project Scaffold

Set up the bare project structure with both servers running and talking to each other.

### Backend
- [x] Initialize backend with `uv init` inside `backend/`
- [x] Add dependencies: `fastapi`, `uvicorn`, `httpx`
- [x] Create `backend/main.py` with a single `GET /api/health` endpoint returning `{ "status": "ok" }`
- [x] Confirm server starts with `uv run uvicorn main:app --reload --port 8000`

### Frontend
- [x] Initialize frontend with `npm create vite@latest frontend -- --template react`
- [x] Install dependencies: `tailwindcss`, `react-router-dom`, `recharts`
- [x] Replace default Vite page with a minimal placeholder: "Smart Compare" heading, brand colors applied
- [x] Add a health check call to `/api/health` on load — display "Backend connected" or "Backend unavailable"
- [x] Configure Vite proxy: `/api` → `http://localhost:8000`

### Scripts
- [x] `scripts/start.sh` — starts both backend and frontend in parallel (Mac/Linux)
- [x] `scripts/stop.sh` — kills both processes
- [x] `scripts/start.bat` — Windows equivalent

### Tests & Success Criteria
- `GET /api/health` returns 200 with `{ "status": "ok" }`
- Frontend loads at `http://localhost:5173` without errors
- "Backend connected" message appears on the page
- Both servers start with a single `./scripts/start.sh` command

**Stop here. Show the running app and wait for approval before proceeding.**

---

## Part 3: F1 Comparison (Core Feature)

Implement the first working sport: F1 athlete comparison using hardcoded local JSON data.

### Backend
- [x] Create `backend/routers/compare.py`
- [x] Create `backend/services/f1.py` with hardcoded F1 athlete stats
- [x] Implement `GET /api/compare/athletes?sport=f1&a={slug}&b={slug}` endpoint
  - Returns: wins, podiums, poles, fastest laps, championships, total points for each athlete
- [x] Save default F1 athletes as JSON in `backend/cache/`:
  - `verstappen.json`, `hamilton.json`, `schumacher.json`
- [x] Data source is local-only for F1 (no live API fetch/re-fetch)

### Frontend
- [x] Sport selector page: show F1 as the only active option (others greyed out, coming soon)
- [x] Athlete selector: two dropdowns pre-populated with default F1 athletes
- [x] Comparison card component:
  - Side-by-side layout, one athlete per column
  - Each stat row: label in center, values on each side
  - Winner value: full opacity + `#ecad0a` highlight
  - Loser value: 35% opacity, same color family
- [x] Wire up to `/api/compare/athletes` endpoint
- [x] Replace the F1 points info button with a small inline toggle inside the points row
- [x] Switch the row label between `Total Points` and `Adjusted Total Points` when the toggle changes
- [x] Add a raw vs today-adjusted F1 points toggle in the comparison UI

### Tests & Success Criteria
- `GET /api/compare/athletes?sport=f1&a=hamilton&b=verstappen` returns correct stat structure
- Comparison card renders with correct winner/loser highlighting
- Default athletes load from local hardcoded/cache data only
- F1 points row uses an inline toggle instead of an info tooltip
- Adjusted points mode shows Schumacher at `3961.0` points and leaves current-era default drivers unchanged
- No console errors

**Stop here. Demo the F1 comparison and wait for approval.**

---

## Part 4: Football & Basketball

Expand to two more sports. No external APIs or scraping — all data is pre-built dummy JSON.

---

### Data Files
- [x] Create `backend/data/` directory for static data files (never re-fetched, not cache)
- [x] Create `backend/data/football_players.json` with realistic career stats for Messi and Ronaldo
  - Stats: goals, assists, appearances, Ballon d'Or wins, hat-tricks, trophies
- [x] Create `backend/data/football_teams.json` with stats for Real Madrid and Barcelona
  - Stats: league titles, Champions League titles, domestic cups, all-time wins
- [x] Create `backend/data/basketball.json` with season-by-season stats for LeBron James and Michael Jordan
  - Stats: points per game, total points, rebounds, assists, championships, MVPs, All-Star selections

### Backend
- [x] Wire football player data to `/api/compare/athletes?sport=football`
- [x] Wire football team data to `/api/compare/teams?sport=football&a={slug}&b={slug}`
- [x] Wire basketball data to `/api/compare/athletes?sport=basketball`

### Frontend
- [x] Enable Football and Basketball in sport selector
- [x] Add entity type toggle: "Athletes" / "Teams" (only Football has teams)
- [ ] Reuse comparison card — stat rows adapt per sport
- [x] Default entities pre-selected when sport changes

### Tests & Success Criteria
- [x] All three sports return valid comparison data
- [x] Team comparison works for football
- [x] No external API calls made for football or basketball
- [x] Switching sports resets selections cleanly

**Stop here. Demo all sports and wait for approval.**

---

## Part 5: Search & Polish

Make the app feel complete with search, loading states, and error handling.

### Backend
- [x] `GET /api/athletes?sport={sport}&q={query}` — search endpoint, returns matching slugs and display names
- [x] `GET /api/teams?sport={sport}&q={query}` — same for teams
- [x] Results limited to 10, case-insensitive match
- [x] Search works across both cached F1 data and static dummy data files

### Frontend
- [x] Replace dropdowns with searchable autocomplete inputs
- [x] Loading skeleton shown while comparison data is fetching
- [x] Error state: "Could not load data for {athlete}" with retry button
- [x] Empty state on first load: show default comparison (Hamilton vs Verstappen) automatically
- [x] Add Morning/Night mode toggle with small Sun/Moon icon switch at top-right corner
- [x] Persist theme preference in browser storage
- [x] Use softer night palette (avoid pure white text and avoid yellow in night mode)
- [x] Replace the F1 points info icon/tooltip with an inline points toggle in the stat row
- [x] Add a raw vs today-adjusted F1 points toggle for cross-era comparison context
- [x] Refine SmartCompare title colors to better fit both themes
- [x] Replace morning yellow highlight with a cooler blue highlight for better visual consistency
- [x] No emojis anywhere in UI copy
- [x] All brand colors used consistently — no hardcoded colors outside Tailwind config

### Final Checks
- [x] App works fully offline if cache files exist
- [x] No auth, no paid APIs, no external sports API dependencies
- [x] README updated: setup instructions only, minimal, no emojis

### Tests & Success Criteria
- Search returns relevant results for partial name matches
- Loading and error states render correctly
- Default comparison loads on first visit with no user interaction
- Morning/Night toggle (Sun/Moon icon) switches global theme instantly and persists after page refresh
- Night mode uses eye-comfortable off-white text and non-yellow winner highlighting
- Total points row can switch inline between raw totals and adjusted totals
- F1 total points can switch between raw totals and today-adjusted contextual totals
- Morning mode winner highlight and logo treatment visually fit the rest of the UI
- Full manual walkthrough passes: F1, Football players, Football teams, Basketball

**Stop here. Final review with user before considering the project complete.**

---

## Data Sources Summary

| Sport      | Entity  | Source                        | Auth | Cost |
|------------|---------|-------------------------------|------|------|
| F1         | Athletes| Hardcoded JSON (`backend/cache/`) | No   | Free |
| Football   | Athletes| Dummy JSON (backend/data/)    | No   | Free |
| Football   | Teams   | Dummy JSON (backend/data/)    | No   | Free |
| Basketball | Athletes| Dummy JSON (backend/data/)    | No   | Free |

---

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | React 19 + Vite                   |
| Styling  | TailwindCSS v4                    |
| Routing  | React Router v7                   |
| Charts   | Recharts                          |
| Backend  | Python 3.13 + FastAPI             |
| Runner   | uvicorn                           |
| Packages | uv                                |
| Cache    | JSON files (backend/cache/)       |
| Data     | JSON files (backend/data/)        |
| Docker   | None                              |
| Auth     | None                              |
| Database | None                              |

---

## Color Scheme

| Token            | Hex       | Usage                                  |
|------------------|-----------|----------------------------------------|
| Blue Primary     | `#209dd7` | Links, card borders, navigation        |
| Purple Secondary | `#753991` | CTA buttons                            |
| Morning Sky      | `#eef7fc` | Morning mode background                |
| Morning Card     | `#ffffff` | Morning mode card surface              |
| Night Background | `#0b1624` | Night mode background                  |
| Night Surface    | `#152334` | Night mode cards and inputs            |
| Night Border     | `#4a5f77` | Night mode borders/dividers            |
| Night Text       | `#dbe4ee` | Night mode text (not pure white)       |
| Night Winner     | `#7fc8ff` | Winner highlight in night mode         |
| Morning Winner   | `#3f8fd0` | Winner highlight in morning mode       |
| Morning Accent   | `#7aa8cc` | Secondary morning glow/accent          |
| Gray Text        | `#888888` | Labels, secondary text                 |
| Loser Fade       | —         | Same color at 35% opacity, never gray  |

