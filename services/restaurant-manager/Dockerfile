FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3004 8084 8083

CMD ["node", "src/server.js"]