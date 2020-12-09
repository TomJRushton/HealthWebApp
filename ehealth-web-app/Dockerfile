FROM node:12.16.1

RUN npm install -g http-server

WORKDIR /ehealth-web
COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 8080
CMD [ "http-server", "dist" ]