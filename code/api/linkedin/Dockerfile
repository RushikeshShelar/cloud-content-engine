# Dockerfile for Twitter Microservice

FROM node:20-alpine

WORKDIR /app

# Optional: in case your code uses native deps
RUN apk add --no-cache python3 make g++

# 1. Copy package files and install ALL deps
COPY package*.json ./
RUN npm install   # installs devDependencies including typescript

# 2. Copy source code
COPY . .

# 3. Build TypeScript
RUN npm run build

# 4. Remove dev dependencies to shrink image
RUN npm prune --production

# 5. Set environment vars (optional)
ENV NODE_ENV=production

# 6. Expose and run
EXPOSE 3000
CMD ["node", "dist/index.js"]
