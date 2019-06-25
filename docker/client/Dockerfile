FROM node:10.16.0-alpine
LABEL maintainer "johnsardine@gmail.com"

ENV PROJECT_DIR /srv/gitlab-time-tracker
WORKDIR $PROJECT_DIR

# Common
COPY ./yarn.lock .
COPY ./package.json .

RUN yarn

# Client Related
COPY ./public public
COPY ./src src

EXPOSE 3000

CMD yarn start
