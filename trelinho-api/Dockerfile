FROM node:20

WORKDIR /app/trelinho-api

COPY trelinho-config /app/trelinho-config
COPY trelinho-api/package.json trelinho-api/pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install

COPY trelinho-api .

RUN pnpm prisma generate

EXPOSE 3000

CMD ["pnpm", "start:dev"]