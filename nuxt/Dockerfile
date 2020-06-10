# Base image
FROM mhart/alpine-node:12
# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json package-lock.json /app/
RUN npm install

# Bundle app source
COPY . /app