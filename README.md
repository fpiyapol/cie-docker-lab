# Docker lab

In this lab, we going to run a Books service app. Books service app consists of web (ExpressJS) and database (MongoDB) services.

## Prerequisite

1. Install docker.

   ```
   sudo yum update -y
   sudo amazon-linux-extras install docker
   sudo service docker start
   sudo usermod -a -G docker ec2-user
   ```

   > After installing docker, closing the current SSH session and reconnecting.

1. Install docker-compose

   ```
   sudo curl -L "https://github.com/docker/compose/releases/download/1.28.5/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

   sudo chmod +x /usr/local/bin/docker-compose
   ```

1. Install git.

   ```
   sudo yum install git -y
   ```

1. Clone the project.
   ```
   git clone https://github.com/fpiyapol/cie-docker-lab.git
   ```

## Create Docker file

1. Change directory to `cie-docker-lab`.

   ```
   cd cie-docker-lab 
   ```

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

   > Please make sure firewall allows connection on port 8080 and the web service container is running.

## Run MongoDB Database Service

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

   > Book service app uses the `SERVICE_VERSION` variable to toggle version to use an external database.

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
     web:
       image: web
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
   # delete all containers
   docker rm -f $(docker ps -aq)

   # run docker compose
   docker-compose up -d
   ```

1. Test web service.
