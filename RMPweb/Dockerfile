# https://gist.github.com/aradalvand/04b2cad14b00e5ffe8ec96a3afbb34fb
FROM node:21.7.1-alpine AS builder
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --production

FROM node:21.7.1-alpine
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY --from=builder /app/.env* .
COPY package.json .
EXPOSE 3000
ENV NODE_ENV=production
ENV ORIGIN=http://localhost:3000
CMD [ "node", "-r", "dotenv/config", "build" ]
