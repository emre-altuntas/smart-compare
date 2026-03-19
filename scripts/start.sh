#!/bin/bash
echo "Starting backend..."
cd backend
uv run uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!

echo "Starting frontend..."
cd ../frontend
npm run dev -- --host &
FRONTEND_PID=$!

echo "Both servers running. Press Ctrl+C to stop."
wait
