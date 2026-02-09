# ========================================
# Stage 1: Build
# Usa latest-dev pois precisa do npm para build
# ========================================
FROM cgr.dev/chainguard/node:latest-dev AS builder

# Argumentos para build time
ARG FRONTEND_API_URL=http://localhost:5000/api
ARG NODE_ENV=production
ENV FRONTEND_API_URL=$FRONTEND_API_URL
ENV NODE_ENV=$NODE_ENV

WORKDIR /app

# Copia arquivos de dependências
COPY --chown=node:node package*.json ./

# Instala todas as dependências (necessário para build)
RUN npm ci --no-audit --no-fund

# Copia código fonte
COPY --chown=node:node . .

# Build da aplicação Nuxt
RUN npm run build:prod

# Remove devDependencies e limpa cache
RUN npm prune --production --no-audit --no-fund && \
    npm cache clean --force

# ========================================
# Stage 2: Production
# Usa latest (sem npm) - mais leve e sem vulnerabilidades
# ========================================
FROM cgr.dev/chainguard/node:latest AS production

WORKDIR /app

# Copia apenas o build final (.output) do stage anterior
COPY --from=builder --chown=node:node /app/.output ./.output

# Variáveis de ambiente
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000

EXPOSE 3000

# Usuário non-root (já é o padrão na Chainguard, mas deixo explícito)
USER node

# Inicia o servidor Nitro (ENTRYPOINT já tem /usr/bin/node)
CMD ["./.output/server/index.mjs"]
