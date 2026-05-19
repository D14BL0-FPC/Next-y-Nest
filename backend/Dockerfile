# --- Build Stage ---
FROM node:22-alpine AS builder
WORKDIR /app

# better-sqlite3 requires native build tools to compile C++ bindings on Alpine
RUN apk add --no-cache python3 make g++ sqlite-dev

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Remove development dependencies to keep the image slim
RUN npm prune --production

# --- Production Stage ---
FROM node:22-alpine
WORKDIR /app

# Ensure runtime dependencies for sqlite are available
RUN apk add --no-cache sqlite-dev

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

EXPOSE 3001
ENV NODE_ENV=production
CMD ["npm", "run", "start:prod"]
