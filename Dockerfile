FROM node:18.10.0

WORKDIR /app

ARG NODE_ENV=production

COPY package*.json ./

RUN npm install

COPY . ./

CMD ["npm", "run", "start"]