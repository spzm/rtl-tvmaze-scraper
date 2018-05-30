FROM node:8.11-alpine

RUN mkdir /app
WORKDIR /app

COPY package.json /app
RUN yarn install

COPY . /app

EXPOSE 3005

CMD ["node", "src/index.js"]
