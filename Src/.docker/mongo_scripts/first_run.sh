#!/bin/bash
# https://github.com/frodenas/docker-mongodb/blob/master/Dockerfile

ROOT_USER=${MONGODB_ROOT_USERNAME}
# ROOT_PASS=${MONGODB_ROOT_PASSWORD:-$(pwgen -s -1 16)}
ROOT_PASS=${MONGODB_ROOT_PASSWORD}
ROOT_DB="admin"
ROOT_ROLE=${MONGODB_ROOT_ROLE}

USER=${MONGODB_USERNAME}
PASS=${MONGODB_PASSWORD}
DB=${MONGODB_DBNAME}
ROLE=${MONGODB_ROLE}

# Start MongoDB service
#/usr/bin/mongod --nojournal &
/usr/bin/mongod &
while ! nc -vz localhost 27017; do sleep 1; done

# Create Root User if there are values (-z means empty, -n means not empty)
if [[ -n $ROOT_USER ]] && [[ -n $ROOT_PASS ]] && [[ -n $ROOT_ROLE ]]
then
	echo "Creating root user: \"$ROOT_USER\"..."
	mongo $ROOT_DB --eval "db.createUser({ user: '$ROOT_USER', pwd: '$ROOT_PASS', roles: [ { role: '$ROOT_ROLE', db: '$ROOT_DB' } ] });"
fi

# Create Web User if there are values (-z means empty, -n means not empty)
if [[ -n $USER ]] && [[ -n $PASS ]] && [[ -n $ROLE ]] && [[ -n $DB ]]
then
	echo "Creating web user: \"$USER\"..."
	mongo $DB --eval "db.createUser({ user: '$USER', pwd: '$PASS', roles: [ { role: '$ROLE', db: '$DB' } ] });"
fi

# Stop MongoDB service
/usr/bin/mongod --shutdown

echo "========================================================================"
echo "MongoDB Root User: $ROOT_USER"
echo "MongoDB Root Role: $ROOT_ROLE"
echo "========================================================================"
echo "========================================================================"
echo "MongoDB User: $USER"
echo "MongoDB Database: $DB"
echo "MongoDB Role: $ROLE"

rm -f /.firstrun