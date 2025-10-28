FROM node:18-alpine AS base

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

FROM base AS build
RUN npm run build

FROM node:18-alpine AS prod

WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/dist /app/dist

EXPOSE 80

CMD ["serve", "-s", "dist", "-l", "80"]