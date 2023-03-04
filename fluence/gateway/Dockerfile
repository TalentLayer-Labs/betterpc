FROM node:16.3.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN apk add --no-cache python3 g++ make

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "run" ]