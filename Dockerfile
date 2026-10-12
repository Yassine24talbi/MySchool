FROM node:22-bookworm-slim AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts
COPY apps ./apps
COPY shared ./shared
RUN VITE_API_URL=/api npm run build

FROM node:22-bookworm-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts \
    && mkdir -p /app/server/data \
    && chown -R node:node /app
COPY --chown=node:node server ./server
COPY --from=build --chown=node:node /app/apps/student/dist ./apps/student/dist
COPY --from=build --chown=node:node /app/apps/teacher/dist ./apps/teacher/dist
COPY --from=build --chown=node:node /app/apps/admin/dist ./apps/admin/dist

USER node
EXPOSE 3000
CMD ["node", "server/index.js"]
