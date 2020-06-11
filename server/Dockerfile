# Base image
FROM mhart/alpine-node:12.18.0
# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json package-lock.json /app/
RUN npm install
RUN npm install -g nodemon

# Bundle app source
# COPY . /app
