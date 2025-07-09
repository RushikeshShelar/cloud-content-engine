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
docker build -t cloud-test:x ./code/api/x

# 2. Build LinkedIn microservice container
echo "🐳 Building LinkedIn microservice container..."
docker build -t cloud-test:linkedin ./code/api/linkedin

# 2. Build Insta microservice container
echo "🐳 Building LinkedIn microservice container..."
docker build -t cloud-test:insta ./code/api/insta

# 3. Run X container with mounted volume
echo "🚀 Running X microservice..."
docker run --rm \
    --name cloud-test-x \
    -d \
    --env-file .env \
    -p 3000:3000 \
    -v $(pwd)/tmp/shared:/app/content \
  cloud-test:x

# 3. Run LinkedIn microservice
echo "🚀 Running LinkedIn microservice..."
docker run --rm \
    --name cloud-test-linkedin \
    -d \
    --env-file .env \
    -p 3001:3000 \
    -v $(pwd)/tmp/shared:/app/content \
  cloud-test:linkedin

# 3. Run Insta microservice
echo "🚀 Running LinkedIn microservice..."
docker run --rm \
    --name cloud-test-insta \
    -d \
    --env-file .env \
    -p 3002:3000 \
    -v $(pwd)/tmp/shared:/app/content \
  cloud-test:insta

# 4. Wait for container to boot
until curl --silent --fail http://localhost:3000/; do
    echo "Waiting for X container..."
    sleep 1
done

echo "✅ X microservice is up!"

# 4 Wait for LinkedIn container to boot
until curl --silent --fail http://localhost:3001/; do
    echo "Waiting for LinkedIn container..."
    sleep 1
done

echo "✅ LinkedIn microservice is up!"

# 5 Wait for LinkedIn container to boot
until curl --silent --fail http://localhost:3002/; do
    echo "Waiting for Insta container..."
    sleep 1
done

echo "✅ Insta microservice is up!"


# 5. Post to Twitter
echo "🐦 Posting to Twitter..."
curl -X POST http://localhost:3000/api/tweet \
    -H "Content-Type: application/json"

# 5. Post to LinkedIn
echo "🔗 Posting to LinkedIn..."
curl -X POST http://localhost:3001/api/share \
    -H "Content-Type: application/json" \
    -d '{
        "mediaType": "image"
    }'

# 5. Post to Instagram
echo "📸 Posting to Instagram..."
curl -X POST http://localhost:3002/api/post 

# 6. Clean up
echo "🧹 Cleaning up..."
docker stop cloud-test-linkedin > /dev/null
docker stop cloud-test-x > /dev/null
docker stop cloud-test-insta > /dev/null

echo "✅ Test complete!"