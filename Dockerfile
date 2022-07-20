FROM node:16-alpine as node
RUN apk add  --no-cache ffmpeg ttf-dejavu

WORKDIR /home/node/app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm i

COPY . .

RUN npm run build

CMD npm run start