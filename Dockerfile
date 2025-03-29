# Dockerfile
FROM node:22-alpine

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install dependencies
RUN npx bun install

# Copy source code
COPY . .

# Build the application (adjust if your build script differs)
RUN npx bun run build

# Expose the port from your configuration (52523)
EXPOSE 52523

# Start command (adjust based on your actual start script)
CMD ["node", "build"]