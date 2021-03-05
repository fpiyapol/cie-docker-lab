# Docker lab

In this repository, we gonna run a Books service app. Books service app consists of web (ExpressJS) and database (MongoDB) services.

## Create Docker file

1. Create `Dockerfile` for a web service with below content.

   ```
   FROM node:12.21.0-alpine3.12

   WORKDIR /usr/src/app

   COPY ./web ./

   RUN npm install

   EXPOSE 8080

   CMD [ "node", "main.js" ]
   ```

1. Run following command to build a web service image.

   ```
   docker build -t web .
   ```

1. Inspect web image.

   ```
   docker images
   ```

1. Run a web service container.

   ```
   docker run -d --name web -p 8080:8080 web
   ```

1. Inspect web service container.

   ```
   docker ps
   ```

1. Test web service by go to `<IP address>:8080/books`. You should see book information.

   ```
   [
     {
       id: "1",
       name: "alice"
     },
     {
       id: "2",
       name: "bob"
     }
   ]
   ```

## Run Mongodb Database

1. Issue following command.

   ```
   docker run -d --name mongodb -p 27017:27017 \
   -v $(pwd)/database:/docker-entrypoint-initdb.d bitnami/mongodb:4.2.10-debian-10-r26
   ```

1. Inspect the database.

   ```
   docker ps
   # should see mongodb container running.

   docker exec -it mongodb mongo
   show dbs
   # should see books database

   use books
   show collections
   db.books.find()
   # should see books information.

   exit
   ```

1. run web service again.

   ```
   docker rm -f web
   docker run -d --name web -p 8080:8080 --link mongodb:mongodb \
   -e SERVICE_VERSION=v2 -e 'MONGODB_URL=mongodb://mongodb:27017/books' web
   ```

   > Book sevice use `SERVICE_VERSION` to toggle version and use external database.

1. Test web service. Now you should see new books information.

   ```
   [
     {
       id: "1",
       name: "Kubernetes in Action"
     },
     {
       id: "2",
       name: "The Phoenix Project"
     }
   ]
   ```

Create Docker-Compose file

1. Create `docker-compose.yml` with following content.

   ```
   version: "3.8"
   services:
   books:
       build: .
       ports:
       - "8080:8080"
       environment:
       SERVICE_VERSION: v2
       MONGODB_URL: mongodb://mongodb:27017/books
   mongodb:
       image: bitnami/mongodb:4.2.10-debian-10-r26
       ports:
       - "27017:27017"
       volumes:
       - ./database:/docker-entrypoint-initdb.d
   ```

1. Run docker-compose.

   ```
   docker rm -f web
   docker rm -f mongodb
   docker-compose up -d
   ```

1. Test book service.
