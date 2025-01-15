FROM node:latest

WORKDIR /home/app

COPY index.js /home/app/index.js
COPY package-lock.json /home/app/package-lock.json
COPY package.json /home/app/package.json


RUN npm install

EXPOSE 9000

CMD [ "npm", "start"]