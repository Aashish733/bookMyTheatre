# #build stage
# FROM node:20-alpine AS builder

# WORKDIR /app

# COPY package*.json ./

# RUN npm ci

# COPY . .

# RUN npm run build

# #production stage

# FROM node:20-alpine

# WORKDIR /app

# COPY package*.json ./

# RUN npm ci --omit=dev

# COPY --from=builder /app/dist ./dist

# RUN chown -R node:node /app && chmod -R 755 /app

# RUN npm install pm2 -g

# COPY ecosystem.config.js .
# COPY start.sh .

# RUN chmod +x start.sh

# USER node

# EXPOSE 8000

# CMD ["sh", "start.sh"]

FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

RUN chown -R node:node /app

USER node

EXPOSE 8000

CMD ["node","dist/server.js"]