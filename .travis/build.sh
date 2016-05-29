#!/bin/bash

set -ev

TAG="$REPOSITORY/$PROJECT-$ARCH"
TAGSPECIFIER="$VERSION"

docker pull   "$REPOSITORY/node-$ARCH:4.4.3"
docker tag -f "$REPOSITORY/node-$ARCH:4.4.3" "node:4.4.3"

npm () {
    docker run --rm -v $(pwd)/contrib/mechanic:/usr/local/src -w /usr/local/src -e NPM_CONFIG_LOGLEVEL=info node:4.4.3 npm --unsafe-perm $@
}

npm install
npm pack

docker build -t "$TAG:$TAGSPECIFIER" contrib/mechanic
