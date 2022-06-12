FROM node:12

WORKDIR /srv

COPY package.json yarn.lock ./
RUN yarn install
COPY . .

CMD [ "yarn", "run", "start" ]