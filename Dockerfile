FROM node:12.16.2-alpine

RUN mkdir /app 
WORKDIR /app

COPY . .

RUN npm ci

CMD ["npm", "start"]