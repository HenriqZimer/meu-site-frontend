# --- Estágio 1: Builder ---
FROM cgr.dev/chainguard/node:latest AS builder

# Define o diretório de trabalho
WORKDIR /app

# 1. Copia package.json com a posse correta para o usuário 'node'
COPY --chown=node:node package*.json ./

# Instala as dependências
RUN npm ci

# 2. Copia o código fonte também garantindo a posse para o usuário 'node'
COPY --chown=node:node . .

# Agora o usuário 'node' tem permissão de escrita na pasta /app para criar a .output
RUN npm run build

# --- Estágio 2: Production ---
FROM cgr.dev/chainguard/node:latest AS production

WORKDIR /app

# Copia apenas os artefatos gerados, mantendo a posse correta
COPY --from=builder --chown=node:node /app/.output ./.output

# Variáveis de ambiente
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

CMD ["./.output/server/index.mjs"]