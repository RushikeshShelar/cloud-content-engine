#!/bin/bash

set -e

echo "📦 Running Local DevOps Automation Test..."

# 1. Go to scripts and fetch content
echo "🔽 Fetching content from S3..."
cd scripts/node
npm install
npx ts-node fetchData.ts
cd ../../

# 2. Build Docker image
echo "🐳 Building X microservice container..."
docker build -t cloud-test:local ./code/api/x

# 3. Run container with mounted volume
echo "🚀 Running X microservice..."
docker run --rm \
    --name cloud-test \
    -d \
    --env-file .env \
    -p 3000:3000 \
    -v $(pwd)/tmp/shared:/app/content \
  cloud-test:local

# 4. Wait for container to boot
until curl --silent --fail http://localhost:3000/; do
    echo "Waiting for container..."
    sleep 1
done


# 5. Post to Twitter
echo "🐦 Posting to Twitter..."
curl -X POST http://localhost:3000/api/tweet \
    -H "Content-Type: application/json"

# 6. Clean up
echo "🧹 Cleaning up..."
docker stop cloud-test > /dev/null

echo "✅ Test complete!"