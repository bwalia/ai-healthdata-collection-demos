# Use an official Node.js runtime as the base image
FROM node:20.9.0-alpine3.18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of your application's source code to the container
COPY . .

# Expose the port your application will run on
EXPOSE 3000

# Start your Node.js application
CMD [ "npm", "run", "dev" ]
