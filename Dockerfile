FROM node:10-jessie

ADD https://github.com/just-containers/s6-overlay/releases/download/v1.22.1.0/s6-overlay-amd64.tar.gz /tmp/
RUN tar xzf /tmp/s6-overlay-amd64.tar.gz -C /

RUN adduser --system abc --group


ADD package*.json /app/

WORKDIR /app

RUN npm i --production

ADD . /app/
COPY root/ /

ENV ENV_FILE=/config/.env

ENTRYPOINT ["/init","s6-setuidgid","abc"]
CMD ["node","server.js"]

VOLUME [ "/config" ]