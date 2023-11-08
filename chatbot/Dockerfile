# Use an official Node.js runtime as the base image
FROM node:20.9.0-alpine3.18

# Set the working directory in the container
WORKDIR /app

# Copy the Nuxt.js application files (package.json and package-lock.json) to the container
COPY package*.json ./

# Install Nuxt.js dependencies
RUN npm install

# Copy the built Nuxt.js application files (you should have a "dist" folder with the output files)
COPY . .

# Expose the port your Nuxt.js app will run on
EXPOSE 3000

# Start the Nuxt.js app
CMD ["npm", "run", "dev"]
