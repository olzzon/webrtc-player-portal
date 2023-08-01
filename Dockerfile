# BUILD IMAGE
FROM node:16.14-alpine
RUN apk add --no-cache git
WORKDIR /opt/webrtc-player-portal
COPY package*.json ./
RUN yarn --check-files --frozen-lockfile
COPY . .
RUN yarn build:server
RUN yarn build:client
RUN yarn --check-files --frozen-lockfile --production --force
RUN yarn cache clean

# DEPLOY IMAGE
FROM node:16.14-alpine
WORKDIR /opt/webrtc-player-portal
COPY --from=0 /opt/webrtc-player-portal .
EXPOSE 3000/tcp
CMD ["yarn", "start"]
