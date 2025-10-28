FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN corepack enable \
 && corepack prepare pnpm@10.19.0 --activate \
 && pnpm install

COPY . .

EXPOSE 4000

CMD ["pnpm", "run", "dev"]