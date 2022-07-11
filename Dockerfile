FROM node:16.16-alpine

WORKDIR /app

RUN apk add --no-cache bash
RUN yarn global add typescript
RUN yarn global add ts-node

COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock
RUN yarn install --prod

COPY ./src ./src
COPY ./entrypoint.sh ./entrypoint.sh
COPY ./tsconfig.json ./tsconfig.json
RUN chmod +x entrypoint.sh

CMD ["/bin/bash", "entrypoint.sh"]
