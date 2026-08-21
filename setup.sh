#!/bin/bash
# HealthBridge - Linux setup script
# Installs dependencies and starts the AI + Python services via Docker Compose.

set -e

echo "== HealthBridge setup =="

if [ -z "$GROQ_API_KEY" ]; then
  echo "WARNING: GROQ_API_KEY is not set. The /ask and /agent endpoints will fail without it."
  echo "Run: export GROQ_API_KEY=your_key_here"
fi

if ! command -v docker &> /dev/null; then
  echo "Docker not found. Installing Docker..."
  sudo apt-get update
  sudo apt-get install -y docker.io docker-compose-plugin
fi

echo "Building and starting services..."
docker compose up --build -d

echo "Done. Services:"
echo "  AI Service:      http://localhost:8001/health"
echo "  Python Service:  http://localhost:8002/health"
