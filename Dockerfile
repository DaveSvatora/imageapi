FROM node:lts-alpine
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN mkdir /uploads
VOLUME /uploads
EXPOSE 8080
CMD [ "node", "index.js" ]

# docker build -t imageapi:latest --force-rm .