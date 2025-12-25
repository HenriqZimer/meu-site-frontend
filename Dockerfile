# --- Estágio 1: Builder ---
FROM cgr.dev/chainguard/node:latest AS builder

WORKDIR /app

# Copia arquivos de dependência primeiro para aproveitar o cache de camadas
COPY package*.json ./

# Instala todas as dependências (necessário para o build)
RUN npm ci

# Copia o restante do código
COPY . .

# Executa o build (ajuste para o comando correto do seu projeto, ex: npm run build)
RUN npm run build

# --- Estágio 2: Production ---
FROM cgr.dev/chainguard/node:latest

WORKDIR /app

# Copia apenas o que é necessário para rodar o servidor (saída do Nitro/Nuxt)
COPY --from=builder /app/.output ./.output

# Variáveis de ambiente para produção
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Expõe a porta que o Node irá rodar
EXPOSE 3000

# Comando para iniciar o servidor Nitro
CMD ["./.output/server/index.mjs"]