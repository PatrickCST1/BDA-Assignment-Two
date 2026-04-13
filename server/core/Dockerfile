FROM node:20-slim

# Create app directory
WORKDIR /app

# Install dependencies first (better caching)
COPY package.json package-lock.json* ./
RUN npm install --production

# Copy the rest of the app
COPY . .

# Expose Express port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
