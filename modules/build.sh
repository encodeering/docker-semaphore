#!/bin/bash

set -e

import com.encodeering.docker.config
import com.encodeering.docker.docker

docker-pull "$REPOSITORY/node-$ARCH:4.4.3" "node:4.4.3"

npm () {
    docker run --rm -v $(pwd)/mechanic:/usr/local/src -w /usr/local/src -e NPM_CONFIG_LOGLEVEL=info node:4.4.3 npm --unsafe-perm $@
}

npm install
npm pack

docker build -t "$DOCKER_IMAGE" mechanic

docker run --rm "$DOCKER_IMAGE" semaphore --help
