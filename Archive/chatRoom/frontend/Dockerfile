FROM node:latest

WORKDIR /frontend-app

COPY package.json yarn.lock ./

RUN yarn

COPY . .

EXPOSE 5173

RUN ["chmod", "+x", "/usr/local/bin/docker-entrypoint.sh"]

CMD ["yarn", "dev"]