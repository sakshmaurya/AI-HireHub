# AI HireHub - Deployment Guide

## Prerequisites

- Docker and Docker Compose installed
- Node.js 20+ (for local development)
- MongoDB 7.0+
- Redis 7+
- Cloudinary account
- SMTP email service (Gmail, SendGrid, etc.)
- Gemini API or OpenAI API key

## Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=8000
NODE_ENV=production

# Database
MONGODB_URI=mongodb://localhost:27017/ai-hirehub

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here_change_in_production
REFRESH_TOKEN_EXPIRE=30d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM_EMAIL=your_email@gmail.com
SMTP_FROM_NAME=AI HireHub

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# AI Configuration
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload Limits
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=.pdf,.doc,.docx,.jpg,.jpeg,.png
```

## Local Development

### 1. Clone the repository

```bash
git clone <repository-url>
cd AI-HireHub
```

### 2. Install dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Start MongoDB and Redis (using Docker)

```bash
docker-compose -f docker-compose.dev.yml up -d
```

### 4. Configure environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp backend/.env.example backend/.env
```

### 5. Start the backend

```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:8000`

### 6. Start the frontend

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

## Production Deployment

### Using Docker Compose

1. Build and start all services:

```bash
docker-compose up -d
```

2. Check service status:

```bash
docker-compose ps
```

3. View logs:

```bash
docker-compose logs -f
```

4. Stop services:

```bash
docker-compose down
```

### Manual Deployment

#### Backend Deployment

1. Build the backend:

```bash
cd backend
npm install
npm run build
```

2. Start the backend:

```bash
NODE_ENV=production npm start
```

#### Frontend Deployment

1. Build the frontend:

```bash
cd frontend
npm install
npm run build
```

2. Serve the built files using nginx or any static file server:

```bash
# Using nginx
cp -r dist/* /var/www/ai-hirehub/
```

### Vercel Deployment (Frontend)

1. Connect your repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables
5. Deploy

### Railway/Render Deployment (Backend)

1. Connect your repository to Railway/Render
2. Set build command: `cd backend && npm install && npm run build`
3. Set start command: `cd backend && npm start`
4. Add environment variables
5. Deploy

## Database Setup

### MongoDB

The application will automatically create the necessary collections on first run. For manual setup:

```bash
# Connect to MongoDB
mongosh mongodb://localhost:27017/ai-hirehub

# Create indexes (optional, handled by the app)
```

### Redis

Redis is used for caching and session management. No additional setup required.

## Monitoring

### Health Check

```bash
curl http://localhost:8000/health
```

### Logs

- Backend logs: Check console or configure a logging service
- Frontend logs: Browser console
- Docker logs: `docker-compose logs -f [service-name]`

## Security Considerations

1. Change all default secrets and passwords
2. Use HTTPS in production
3. Configure CORS properly
4. Enable rate limiting
5. Use environment variables for sensitive data
6. Regular security updates
7. Implement backup strategy for MongoDB

## Scaling

### Horizontal Scaling

- Use a load balancer (nginx, HAProxy)
- Deploy multiple backend instances
- Use Redis for session sharing
- Use MongoDB replica set

### Vertical Scaling

- Increase server resources
- Optimize database queries
- Implement caching
- Use CDN for static assets

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check if MongoDB is running
   - Verify connection string in `.env`
   - Check firewall settings

2. **Redis Connection Error**
   - Check if Redis is running
   - Verify Redis host and port
   - Check firewall settings

3. **Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version (should be 20+)
   - Verify all dependencies are installed

4. **Port Already in Use**
   - Change PORT in `.env`
   - Kill process using the port
   - Use different ports in docker-compose.yml

## Backup

### MongoDB Backup

```bash
# Backup
mongodump --uri="mongodb://localhost:27017/ai-hirehub" --out=/backup/path

# Restore
mongorestore --uri="mongodb://localhost:27017/ai-hirehub" /backup/path
```

### Redis Backup

```bash
# Backup
redis-cli BGSAVE

# Restore
cp dump.rdb /var/lib/redis/
```

## Support

For issues and questions, please refer to the project documentation or create an issue in the repository.
