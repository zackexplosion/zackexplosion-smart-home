# Base image
FROM node:latest
# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json yarn.lock /usr/src/app/
RUN yarn install --production && yarn cache clean

# Bundle app source
COPY . /usr/src/app