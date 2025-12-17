# --- Stage 1: Builder ---
FROM node:lts-trixie-slim AS builder

# Seleciona o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala dependências
RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline --no-audit --progress=false --loglevel=error

# Copia o código fonte
COPY . .

# Define a URL da API para o build
ARG FRONTEND_API_URL=/api
ENV FRONTEND_API_URL=${FRONTEND_API_URL}

# Gera o site estático
RUN npm run build:prod

# --- Stage 2: Production ---
FROM nginx:mainline-alpine3.23

# Copia os arquivos estáticos do estágio builder
COPY --from=builder /app/.output/public /usr/share/nginx/html

# Expõe a porta
EXPOSE 80

# Inicia o nginx
CMD ["nginx", "-g", "daemon off;"]