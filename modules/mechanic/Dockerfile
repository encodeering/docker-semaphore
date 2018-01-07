FROM       node:4.8

MAINTAINER Michael Clausen <encodeering@gmail.com>

ENV        SEMAPHORECI_API_KEY=secret

RUN        useradd -m -s /bin/bash -u 1001 -U mechanic

COPY       docker-semaphore-*.tgz /tmp

RUN        npm install --unsafe-perm -g /tmp/docker-semaphore-*.tgz \
 &&        rm                           /tmp/docker-semaphore-*.tgz

VOLUME     /usr/local/src

WORKDIR    /usr/local/src

USER       mechanic

ENTRYPOINT ["docker-exec"]

CMD        ["semaphore", "--help"]
