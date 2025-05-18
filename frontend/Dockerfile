FROM node:slim AS base

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 3000

FROM base AS dev

ENV NODE_ENV=development

CMD ["npm", "run", "dev"]

FROM base AS prod

ENV NODE_ENV=production

RUN npm run build

CMD ["npm", "run", "start"]
