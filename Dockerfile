FROM node:10
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN mkdir /uploads
VOLUME /uploads
EXPOSE 3000
CMD [ "node", "app.js" ]

# docker build -t imageapi:latest --force-rm .