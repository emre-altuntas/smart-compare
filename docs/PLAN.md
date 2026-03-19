# Smart Compare — Project Plan

---

## How to use this document

Each part below must be completed in order. After each part, the agent stops and waits
for user review before proceeding. The agent checks off each subtask as it completes it.

---

## Part 1: Review & Approval

Before writing any code, read `docs/agent.md` in full, then confirm the following with the user:

- [x] Tech stack is understood (React + Vite, FastAPI, uv, no Docker, no auth, no paid APIs)
- [x] Color scheme is noted
- [x] Default data entities are noted (Verstappen, Hamilton, Schumacher, Messi, Ronaldo, Real Madrid, Barcelona, LeBron, Jordan)
- [ ] User has reviewed and approved this PLAN.md

**Stop here. Do not proceed until the user explicitly says to continue.**

---

## Part 2: Project Scaffold

Set up the bare project structure with both servers running and talking to each other.

### Backend
- [ ] Initialize backend with `uv init` inside `backend/`
- [ ] Add dependencies: `fastapi`, `uvicorn`, `httpx`
- [ ] Create `backend/main.py` with a single `GET /api/health` endpoint returning `{ "status": "ok" }`
- [ ] Confirm server starts with `uv run uvicorn main:app --reload --port 8000`

### Frontend
- [ ] Initialize frontend with `npm create vite@latest frontend -- --template react`
- [ ] Install dependencies: `tailwindcss`, `react-router-dom`, `recharts`
- [ ] Replace default Vite page with a minimal placeholder: "Smart Compare" heading, brand colors applied
- [ ] Add a health check call to `/api/health` on load — display "Backend connected" or "Backend unavailable"
- [ ] Configure Vite proxy: `/api` → `http://localhost:8000`

### Scripts
- [ ] `scripts/start.sh` — starts both backend and frontend in parallel (Mac/Linux)
- [ ] `scripts/stop.sh` — kills both processes
- [ ] `scripts/start.bat` — Windows equivalent

### Tests & Success Criteria
- `GET /api/health` returns 200 with `{ "status": "ok" }`
- Frontend loads at `http://localhost:5173` without errors
- "Backend connected" message appears on the page
- Both servers start with a single `./scripts/start.sh` command

**Stop here. Show the running app and wait for approval before proceeding.**

---

## Part 3: F1 Comparison (Core Feature)

Implement the first working sport: F1 athlete comparison using the Ergast API (free, no auth).

### Backend
- [ ] Create `backend/routers/compare.py`
- [ ] Create `backend/services/f1.py` with Ergast API integration (`api.jolpi.ca/ergast`)
- [ ] Implement `GET /api/compare/athletes?sport=f1&a={slug}&b={slug}` endpoint
  - Returns: wins, podiums, poles, fastest laps, championships, total points for each athlete
  - Returns: birth dates for same-age mode
- [ ] Pre-fetch and save default F1 athletes as JSON in `backend/cache/`:
  - `verstappen.json`, `hamilton.json`, `schumacher.json`
- [ ] Cache logic: serve from file if exists and younger than 7 days, else re-fetch from Ergast

### Frontend
- [ ] Sport selector page: show F1 as the only active option (others greyed out, coming soon)
- [ ] Athlete selector: two dropdowns pre-populated with default F1 athletes
- [ ] Comparison card component:
  - Side-by-side layout, one athlete per column
  - Each stat row: label in center, values on each side
  - Winner value: full opacity + `#ecad0a` highlight
  - Loser value: 35% opacity, same color family
- [ ] Wire up to `/api/compare/athletes` endpoint

### Tests & Success Criteria
- `GET /api/compare/athletes?sport=f1&a=hamilton&b=verstappen` returns correct stat structure
- Comparison card renders with correct winner/loser highlighting
- Default athletes load from cache without hitting the API
- No console errors

**Stop here. Demo the F1 comparison and wait for approval.**

---

## Part 4: Same-Age Mode

Add the "compare at same age" toggle for athlete comparisons.

### Backend
- [ ] Add `same_age=true` query param to `/api/compare/athletes`
- [ ] When `same_age=true`:
  - Determine the younger athlete by birth date
  - Calculate their current age in years and days
  - Filter both athletes' season-by-season stats to only include seasons up to that age
  - Sum filtered stats and return alongside the cutoff age
- [ ] Age calculation must use birth date, not season number
- [ ] Add unit tests for age calculation logic in `backend/tests/test_same_age.py`

### Frontend
- [ ] Toggle button: "Compare at same age" — styled with `#753991`
- [ ] When active, show age label beneath athlete names: "Stats up to age 28"
- [ ] Re-fetch comparison data with `same_age=true` when toggled
- [ ] Toggle is only shown for athlete comparisons, not team comparisons

### Tests & Success Criteria
- Age cutoff is calculated from birth dates, not seasons
- Stats are correctly filtered and summed up to cutoff age
- UI label shows correct age
- Toggling on/off re-renders the comparison correctly
- Unit tests for age calculation pass

**Stop here. Demo same-age mode and wait for approval.**

---

## Part 5: Football & Basketball

Expand to two more sports. No external APIs or scraping — all data is pre-built dummy JSON.

### Data Files
- [ ] Create `backend/data/` directory for static data files (never re-fetched, not cache)
- [ ] Create `backend/data/football_players.json` with realistic career stats for Messi and Ronaldo
  - Must include season-by-season breakdown with ages for same-age mode to work
  - Must include birth dates
  - Stats: goals, assists, appearances, Ballon d'Or wins, hat-tricks, trophies
- [ ] Create `backend/data/football_teams.json` with stats for Real Madrid and Barcelona
  - Stats: league titles, Champions League titles, domestic cups, all-time wins
- [ ] Create `backend/data/basketball.json` with season-by-season stats for LeBron James and Michael Jordan
  - Must include season-by-season breakdown with ages for same-age mode to work
  - Must include birth dates
  - Stats: points per game, total points, rebounds, assists, championships, MVPs, All-Star selections

### Backend
- [ ] Wire football player data to `/api/compare/athletes?sport=football`
- [ ] Wire football team data to `/api/compare/teams?sport=football&a={slug}&b={slug}`
- [ ] Wire basketball data to `/api/compare/athletes?sport=basketball`
- [ ] Same-age mode works on dummy data identically to F1

### Frontend
- [ ] Enable Football and Basketball in sport selector
- [ ] Add entity type toggle: "Athletes" / "Teams" (only Football has teams)
- [ ] Reuse comparison card — stat rows adapt per sport
- [ ] Default entities pre-selected when sport changes

### Tests & Success Criteria
- All three sports return valid comparison data
- Team comparison works for football
- Same-age mode works correctly for football and basketball
- No external API calls made for football or basketball
- Switching sports resets selections cleanly

**Stop here. Demo all sports and wait for approval.**

---

## Part 6: Search & Polish

Make the app feel complete with search, loading states, and error handling.

### Backend
- [ ] `GET /api/athletes?sport={sport}&q={query}` — search endpoint, returns matching slugs and display names
- [ ] `GET /api/teams?sport={sport}&q={query}` — same for teams
- [ ] Results limited to 10, case-insensitive match
- [ ] Search works across both cached F1 data and static dummy data files

### Frontend
- [ ] Replace dropdowns with searchable autocomplete inputs
- [ ] Loading skeleton shown while comparison data is fetching
- [ ] Error state: "Could not load data for {athlete}" with retry button
- [ ] Empty state on first load: show default comparison (Hamilton vs Verstappen) automatically
- [ ] No emojis anywhere in UI copy
- [ ] All brand colors used consistently — no hardcoded colors outside Tailwind config

### Final Checks
- [ ] App works fully offline if cache files exist
- [ ] No auth, no paid APIs, no external dependencies beyond Ergast (F1 only)
- [ ] README updated: setup instructions only, minimal, no emojis

### Tests & Success Criteria
- Search returns relevant results for partial name matches
- Loading and error states render correctly
- Default comparison loads on first visit with no user interaction
- Full manual walkthrough passes: F1, Football players, Football teams, Basketball, same-age mode on all athlete sports

**Stop here. Final review with user before considering the project complete.**

---

## Data Sources Summary

| Sport      | Entity  | Source                        | Auth | Cost |
|------------|---------|-------------------------------|------|------|
| F1         | Athletes| Ergast API (api.jolpi.ca)     | No   | Free |
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
| Accent Yellow    | `#ecad0a` | Winning stat highlight                 |
| Blue Primary     | `#209dd7` | Links, card borders, navigation        |
| Purple Secondary | `#753991` | CTA buttons, same-age toggle           |
| Dark Navy        | `#032147` | Headings, dark backgrounds             |
| Gray Text        | `#888888` | Labels, secondary text                 |
| Loser Fade       | —         | Same color at 35% opacity, never gray  |