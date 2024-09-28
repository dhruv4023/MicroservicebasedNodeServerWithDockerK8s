# Use Node.js official image as a base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/post-service

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 5002

# Start the application
CMD ["npm", "start"]
