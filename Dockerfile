# Use Node.js 14 LTS as the base image
FROM node:20.11.1-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to work directory
COPY package.json .
COPY package-lock.json . 

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the port on which the NestJS application will run
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "start:prod"]
