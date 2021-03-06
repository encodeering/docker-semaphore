#!/bin/bash

set -e

import com.encodeering.ci.config
import com.encodeering.ci.docker

docker-pull "$REPOSITORY/node-$ARCH:8.16-debian" "node:8.16"

npm () {
    docker run --rm -v $(pwd)/mechanic:/usr/local/src -w /usr/local/src -e NPM_CONFIG_LOGLEVEL=info node:8.16 npm --unsafe-perm $@
}

npm install
npm pack

docker-build mechanic

docker-verify semaphore --help
docker-verify npm -g ls docker-semaphore | dup | contains "@${VERSION}"
