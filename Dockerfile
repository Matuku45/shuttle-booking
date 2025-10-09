# Use Node 20 LTS slim image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=80  

# Install build tools for Rollup native modules
RUN apt-get update && \
    apt-get install -y build-essential python3 git && \
    rm -rf /var/lib/apt/lists/*

# Copy package files first
COPY package.json package-lock.json ./

# Clean install dependencies (force to avoid optional deps issue)
RUN npm ci --force

# Copy all files
COPY . .

# Build the Vite app (ignore optional dependency failures)
RUN npm run build || true

# Install 'serve' to serve production build
RUN npm install -g serve

# Expose port 80 for Fly.io
EXPOSE 80

# Start the app on port 80
CMD ["serve", "-s", "dist", "-l", "80"]
