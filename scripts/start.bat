@echo off
echo Starting backend...
start cmd /k "cd backend && uv run uvicorn main:app --reload --port 8000"

echo Starting frontend...
start cmd /k "cd frontend && npm run dev -- --host"

echo Servers started in separate windows.
