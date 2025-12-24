# --- Stage 1: Builder ---
FROM cgr.dev/chainguard/node:latest AS builder

# Cria o usuário 'node'
USER node

# Define o diretório de trabalho
WORKDIR /usr/src/app

# Copia os arquivos de dependências
COPY --chown=node:node package*.json ./

# Instala as dependências
RUN npm ci --production

# Copia o restante do código da aplicação
COPY --chown=node:node . .

# Define a URL da API para o build
ARG FRONTEND_API_URL=/api
ENV FRONTEND_API_URL=${FRONTEND_API_URL}

# Executa o comando de build que cria o bundle de produção
RUN npm run build:prod

# --- Stage 2: Production ---
FROM nginx:stable-alpine3.23-perl AS production

# Copia os arquivos estáticos do estágio builder
COPY --from=builder /usr/src/app/.output/public /usr/share/nginx/html

# Copia a configuração customizada do nginx
# COPY nginx.conf /etc/nginx/nginx.conf

# Expõe a porta
EXPOSE 80

# Inicia o nginx
CMD ["nginx", "-g", "daemon off;"]