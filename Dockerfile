# Build stage
FROM node:lts-trixie-slim AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# OTIMIZAÇÃO AQUI:
# Usamos o cache do Docker para guardar os módulos baixados em /root/.npm
# Isso evita baixar a internet inteira se você mudar uma vírgula no código
RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline --no-audit --progress=false --loglevel=error

# Copy source code
COPY . .

# Set API URL for build
ARG FRONTEND_API_URL=/api
ENV FRONTEND_API_URL=${FRONTEND_API_URL}

# Generate static site
RUN npm run generate

# Production stage
FROM nginx:mainline-alpine3.23

# Copy static files from builder stage
COPY --from=builder /app/.output/public /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]