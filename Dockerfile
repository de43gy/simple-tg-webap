FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --production && npm cache clean --force

COPY . .

RUN mkdir -p public && cp index.html public/

EXPOSE 3000

USER node

CMD ["node", "server.js"]