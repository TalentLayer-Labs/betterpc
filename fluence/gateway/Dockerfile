FROM node:16.3.0-alpine

WORKDIR ../usr/src/app

COPY package*.json ./

# ENV PYTHONUNBUFFERED=1
# RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
# RUN python3 -m ensurepip
# RUN pip3 install --no-cache --upgrade pip setuptools
RUN apk add --no-cache python3 g++ make

RUN npm install

COPY .. .

EXPOSE 3000

CMD [ "npm", "run", "run" ]