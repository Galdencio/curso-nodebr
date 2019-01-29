## ---- COMANDOS DOCKER
docker ps // lista todos os containers criados

## ---- POSTGRES
docker run \
    --name postgres \
    -e POSTGRES_USER=heroe \
    -e POSTGRES_PASSWORD=heroe123 \
    -e POSTGRES_DB=heroes \
    -p 5432:5432 \
    -d \
    postgres

docker exec -it postgres /bin/bash // executa o terminal do postgres

## ---- ADMINER
docker run \
    --name adminer \
    -p 8080:8080 \
    --link postgres \
    -d \
    adminer

## ---- MONGODB
docker run \
    --name mongodb \
    -p 27017:27017 \
    -e MONGO_INITDB_ROOT_USERNAME=heroe \
    -e MONGO_INITDB_ROOT_PASSWORD=heroe123 \
    -d \
    mongo:4

docker run \
    --name mongoclient \
    -p 3000:3000 \
    --link mongodb:mongodb \
    -d \
    mongoclient/mongoclient

docker exec -it mongodb \
    mongo --host localhost -u heroe -p heroe123 --authenticationDatabase admin \
    --eval "db.getSiblingDB('herois').createUser({ user: 'galdenciolsn', pwd: 'minhasenha', roles: [{role: 'readWrite', db: 'herois'}]})"