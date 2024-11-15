# Using the official Node.js image as a base image
FROM node:18-alpine

# Setting the working directory in the container
WORKDIR /usr/src/app/nirbhava

# Copy package.json and package-lock.json files
COPY *.json ./

#ENV
ARG DB_SECRET
RUN echo "secret: $DB_SECRET"
# Install the app dependencies
RUN npm install --production

# Copy the rest of the application code
COPY src ./src

RUN sed -i "s|DB_SCREAT_PLACEHOLDER|$DB_SECRET|g" src/config/db.js

# Runs on port 5001 as defined by .env
EXPOSE 5001

# Command to run application
CMD ["npx", "nodemon", "./src/app.js"]
