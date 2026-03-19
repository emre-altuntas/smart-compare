#!/bin/bash
echo "Stopping backend and frontend..."
pkill -f "uvicorn main:app"
pkill -f "vite"
echo "Stopped."
