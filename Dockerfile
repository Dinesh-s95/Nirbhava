# Using the official Node.js image as a base image
FROM node:18-alpine

# Setting the working directory in the container
WORKDIR /usr/src/app/nirbhava

# Copy package.json and package-lock.json files
COPY *.json ./

# Install the app dependencies
RUN npm install --production

# Copy the rest of the application code
COPY src ./src
COPY .env ./

# Runs on port 5001 as defined by .env
EXPOSE 5001

# Command to run application
CMD ["npx", "nodemon", "./src/app.js"]
