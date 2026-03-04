FROM node:20-alpine

WORKDIR /app/trelinho-client

COPY trelinho-config /app/trelinho-config
COPY trelinho-client/package.json trelinho-client/pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install

COPY trelinho-client .

EXPOSE 5173

CMD ["pnpm", "dev", "--host"]