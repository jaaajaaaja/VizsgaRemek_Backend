FROM node:22.19.0-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache netcat-openbsd


COPY package*.json ./
COPY tsconfig*.json ./
COPY eslint.config.mjs ./
COPY prisma ./prisma
RUN mkdir uploads

RUN npm install

RUN npm install -g @nestjs/cli

COPY src ./

RUN npx prisma generate

RUN npm run build

COPY docker-entrypoint.sh /usr/local/bin
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT [ "docker-entrypoint.sh" ]

EXPOSE 3000
EXPOSE 5555

CMD [ "node", "dist/src/main.js" ]