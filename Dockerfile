FROM node:16.15

WORKDIR /app

COPY . .
RUN chmod +x entrypoint.sh
RUN yarn install

CMD ["/bin/bash", "entrypoint.sh"]
