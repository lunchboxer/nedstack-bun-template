#!/bin/bash

localdb=database/development.db

if [ ! -f $localdb ]; then
    echo "Creating development database at $localdb"
    touch $localdb
fi

atlas schema apply --to file://database/schema.sql -u sqlite://$localdb --dev-url "sqlite://dev?mode=memory"
