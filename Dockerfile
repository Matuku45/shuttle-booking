# ---- Stage 1: Build ----
FROM node:20-bullseye AS builder

WORKDIR /app
ENV NODE_ENV=development

# Copy and install dependencies (use bullseye so native Rollup builds properly)
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# ---- Stage 2: Runtime ----
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=80

# Copy only built output + minimal deps
COPY --from=builder /app/dist ./dist
COPY package*.json ./

# Install only production deps and serve
RUN npm install -g serve

EXPOSE 80
CMD ["serve", "-s", "dist", "-l", "80"]
