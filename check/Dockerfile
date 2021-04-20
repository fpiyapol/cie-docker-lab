FROM node:12.21.0-alpine3.12

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 9099

CMD [ "npm", "start" ]
