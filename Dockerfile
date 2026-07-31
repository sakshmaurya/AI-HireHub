# Backend Dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy backend files
COPY backend ./backend

# Build TypeScript
RUN cd backend && npm run build

# Expose port
EXPOSE 8000

# Start the application
CMD ["node", "backend/dist/index.js"]
