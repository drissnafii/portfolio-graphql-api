FROM node:20-alpine

RUN apk upgrade --no-cache

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN corepack enable \
 && corepack prepare pnpm@10.19.0 --activate \
 && pnpm install --frozen-lockfile \
 && rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

COPY . .

EXPOSE 4000

CMD ["pnpm", "run", "dev"]
