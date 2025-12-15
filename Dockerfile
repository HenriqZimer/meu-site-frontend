# Build stage
FROM node:lts-trixie-slim AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci --prefer-offline --no-audit --progress=false --loglevel=error

# Copy source code
COPY . .

# Set API URL for build (accepts from docker-compose build args)
ARG FRONTEND_API_URL=/api
ENV FRONTEND_API_URL=${FRONTEND_API_URL}

# Generate static site
RUN npm run generate

# Production stage
FROM nginx:mainline-alpine3.23

# Copy static files from builder stage
COPY --from=builder /app/.output/public /usr/share/nginx/html

# Copy custom nginx config if needed (optional)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]