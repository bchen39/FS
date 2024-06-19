FROM node:latest

WORKDIR /backend-app

COPY package.json yarn.lock ./

RUN yarn

COPY . .

EXPOSE 4000

RUN ["chmod", "+x", "/usr/local/bin/docker-entrypoint.sh"]

CMD ["yarn", "dev"]