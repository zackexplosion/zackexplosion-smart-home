# Base image
FROM node:8.12
# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json yarn.lock /usr/src/app/
RUN yarn install && yarn cache clean

# Bundle app source
COPY . /usr/src/app