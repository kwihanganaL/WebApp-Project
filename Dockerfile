# Use Node.js as the base image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy application files
COPY package.json ./
COPY index.js ./

# Expose application port
EXPOSE 3000

# Start application
CMD ["npm", "start"]