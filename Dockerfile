# Use the latest Node 20 LTS slim image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Environment variables
ENV NODE_ENV=production
ENV PORT=80

# Install build tools
RUN apt-get update && \
    apt-get install -y build-essential python3 git && \
    rm -rf /var/lib/apt/lists/*

# Copy dependency files
COPY package*.json ./

# Force clean install (ignore optional dependency warnings)
RUN npm ci --force

# Copy project files
COPY . .

# Force rebuild the Vite app (ignore warnings)
RUN npm run build --if-present || true

# Install serve globally to serve production files
RUN npm install -g serve

# Expose port 80 for Fly.io
EXPOSE 80

# Start the app
CMD ["serve", "-s", "dist", "-l", "80"]
