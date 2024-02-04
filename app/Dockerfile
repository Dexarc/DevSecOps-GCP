# Use an official Node.js runtime as a parent image
FROM node:16

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the contents of the app directory into the container
COPY . .

# Install app dependencies
RUN npm install

# Expose the port on which your app will run
EXPOSE 8080

# Command to run the application
CMD ["node", "index.js"]
