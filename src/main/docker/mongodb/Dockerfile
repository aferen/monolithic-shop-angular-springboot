FROM  mongo
ENV MONGO_INITDB_ROOT_USERNAME=mongoadmin
ENV MONGO_INITDB_ROOT_PASSWORD=secret
COPY data/shop/ /_data/shop
COPY data/initdb.sh /docker-entrypoint-initdb.d/initdb.sh
