#!/bin/bash

set -a
source .env
set +a

localdb=sqlite://database/local.db

echo "Migrating remote database to match local dev database"
atlas schema apply -u "${TURSO_DB_URL}?authToken=${TURSO_AUTH_TOKEN}" \
    --to $localdb --exclude '_litestream_seq,_litestream_lock'
