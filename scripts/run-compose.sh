#!/bin/bash

set -e

LOG_DIR="logs"
mkdir -p $LOG_DIR
LOG_FILE="$LOG_DIR/devops-compose-$(date '+%Y-%m-%d_%H-%M-%S').log"
exec > >(tee -a "$LOG_FILE") 2>&1

echo "📦 Running Docker Compose DevOps Test..."

# Fetch content
echo "🔽 Fetching content from S3... \n"
cd ./scripts/node/
npm install
npx ts-node fetchData.ts
cd ../../

# Build and run containers
docker compose up -d --build

# Wait until all containers are healthy
echo "⏳ Waiting for containers to become healthy..."
sleep 15
echo "✅ All containers are healthy!"

docker compose ps

echo "🟢 All containers healthy. Triggering posts..."

# Post to Instagram
curl -X POST http://localhost:3000/api/post

# Post to LinkedIn
curl -X POST http://localhost:3001/api/share \
  -H "Content-Type: application/json" \
  -d '{"mediaType": "image"}'

# Post to Twitter (X)
curl -X POST http://localhost:3002/api/tweet -H "Content-Type: application/json"

# Cleanup
echo "🧹 Cleaning up containers..."
docker compose down

echo "✅ Workflow complete!"
