#!/bin/sh

set -e
mongoimport --host localhost --db books \
  --collection books --drop --file /docker-entrypoint-initdb.d/books_data.json
