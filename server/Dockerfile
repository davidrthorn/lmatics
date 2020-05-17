FROM node:14.2.0-alpine3.10
ENV NODE_ENV=production

EXPOSE 3000

RUN apk add -U --no-cache ca-certificates

COPY package.json /
COPY yarn.lock /
COPY src /src

RUN yarn

ENTRYPOINT [ "yarn", "start" ]

