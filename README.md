# AI HireHub - Enterprise Recruitment Platform

A complete enterprise-grade AI-powered recruitment ecosystem built with modern technologies. This platform connects candidates, recruiters, and admins with intelligent features like resume parsing, ATS scoring, AI-powered recommendations, and real-time communication.

## 🚀 Features

### 👨‍💼 Candidate Features
- **Authentication**: Secure JWT-based login/register with email verification
- **Profile Management**: Complete profile with skills, experience, education, certifications
- **Resume Builder**: AI-powered resume builder with templates
- **Resume Upload**: Upload and parse resumes (PDF, DOC, DOCX)
- **ATS Score**: Get your resume scored against job descriptions
- **Resume Match %**: See how well your resume matches job requirements
- **AI Resume Improvement**: Get AI suggestions to improve your resume
- **AI Cover Letter**: Generate personalized cover letters
- **AI Career Advisor**: Get career guidance and recommendations
- **AI Interview Questions**: Practice with AI-generated interview questions
- **Mock Interview**: Simulate interviews with AI feedback
- **Skill Gap Analysis**: Identify skills you need to develop
- **Learning Roadmap**: Personalized learning recommendations
- **Job Recommendations**: AI-powered job matching
- **Saved Jobs**: Bookmark interesting opportunities
- **Applied Jobs**: Track all your applications
- **Application Timeline**: Visual timeline of application progress
- **Portfolio**: Showcase your work and projects
- **GitHub/LinkedIn Import**: Import data from social platforms
- **Real-time Notifications**: Stay updated with instant alerts
- **Chat**: Communicate directly with recruiters

### 🧑‍💼 Recruiter Features
- **Company Dashboard**: Complete company management
- **Company Profile**: Showcase your company culture
- **Job Posting**: Create and manage job listings
- **Edit/Delete Jobs**: Full control over job postings
- **Candidate Search**: Advanced search with filters
- **Resume Ranking**: AI-powered candidate ranking
- **AI Candidate Match**: Find best-fit candidates automatically
- **Candidate Comparison**: Compare multiple candidates side-by-side
- **Hiring Pipeline**: Visual pipeline management
- **Interview Scheduling**: Schedule and manage interviews
- **Email Templates**: Custom email templates for communication
- **Hiring Analytics**: Comprehensive hiring metrics
- **Real-time Chat**: Communicate with candidates
- **Video Interview Ready**: Support for video interviews

### 👨‍💻 Admin Features
- **Dashboard**: Platform overview and statistics
- **User Management**: Manage all platform users
- **Recruiter Verification**: Verify recruiter accounts
- **Company Verification**: Approve/reject company registrations
- **Job Moderation**: Review and moderate job postings
- **Analytics**: Platform-wide analytics and reports
- **Reports**: Handle user reports and violations
- **Platform Settings**: Configure platform-wide settings

### 🤖 AI Features
- **Resume Parsing**: Extract information from resumes automatically
- **ATS Scoring**: Score resumes against job descriptions
- **Resume Matching**: Intelligent job-resume matching
- **AI Chat Assistant**: 24/7 AI support
- **Cover Letter Generator**: Create personalized cover letters
- **Career Advisor**: AI-powered career guidance
- **Interview Generator**: Generate relevant interview questions
- **Skill Extraction**: Extract and analyze skills from resumes
- **Salary Prediction**: Predict salary ranges based on market data
- **Career Prediction**: AI career path recommendations

### 🔧 Advanced Features
- **Real-time Notifications**: Socket.io-powered instant updates
- **Chat System**: Real-time messaging between users
- **Video Interview**: Built-in video interview support
- **Calendar Integration**: Schedule management
- **Advanced Search**: Full-text search with filters
- **Smart Filters**: Filter by location, salary, experience, etc.
- **Pagination**: Efficient data loading
- **Bookmarks**: Save important items
- **Reports**: Comprehensive reporting system
- **Activity Logs**: Track all platform activities
- **Audit Logs**: Security and compliance logging

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI, Radix UI
- **Animations**: Framer Motion
- **State Management**: TanStack Query, Redux Toolkit
- **Forms**: React Hook Form
- **Validation**: Zod
- **Routing**: React Router
- **Icons**: Lucide React
- **Real-time**: Socket.io Client
- **Theme**: next-themes

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT, Refresh Tokens
- **Authorization**: RBAC (Role-Based Access Control)
- **Real-time**: Socket.io
- **Caching**: Redis
- **Queue**: Bull (Redis-based queue)
- **File Storage**: Cloudinary
- **Email**: Nodemailer
- **AI**: Gemini API / OpenAI API
- **Security**: Helmet, Rate Limiting, Input Validation, Sanitization

### DevOps
- **Containerization**: Docker, Docker Compose
- **Deployment**: Vercel (Frontend), Railway/Render (Backend)
- **CI/CD**: Ready for GitHub Actions
- **Monitoring**: Logging and health checks

## 📁 Project Structure

```
AI-HireHub/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── routes/          # API routes
│   │   ├── models/          # Database models
│   │   ├── middlewares/     # Custom middlewares
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utility functions
│   │   ├── validators/      # Input validation
│   │   ├── socket/          # Socket.io setup
│   │   ├── types/           # TypeScript types
│   │   └── index.ts         # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom hooks
│   │   ├── redux/           # Redux store
│   │   ├── lib/             # Utility functions
│   │   ├── assets/          # Static assets
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
├── docker-compose.yml
├── docker-compose.dev.yml
├── .dockerignore
├── DEPLOYMENT.md
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- MongoDB 7.0+
- Redis 7+
- Docker & Docker Compose (optional)
- Cloudinary account
- Gemini API or OpenAI API key
- SMTP email service

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AI-HireHub
   ```

2. **Install dependencies**
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

3. **Configure environment variables**
   
   Copy `.env.example` to `.env` in the backend directory:
   ```bash
   cp backend/.env.example backend/.env
   ```
   
   Fill in the required values:
   ```env
   PORT=8000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/ai-hirehub
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=7d
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   REFRESH_TOKEN_EXPIRE=30d
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASSWORD=your_app_password
   SMTP_FROM_EMAIL=your_email@gmail.com
   SMTP_FROM_NAME=AI HireHub
   REDIS_HOST=localhost
   REDIS_PORT=6379
   GEMINI_API_KEY=your_gemini_api_key
   OPENAI_API_KEY=your_openai_api_key
   FRONTEND_URL=http://localhost:5173
   ```

### Running the Application

#### Option 1: Using Docker Compose (Recommended)

1. **Start MongoDB and Redis**
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

2. **Start Backend**
   ```bash
   cd backend
   npm run dev
   ```

3. **Start Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

#### Option 2: Manual Setup

1. **Start MongoDB**
   ```bash
   mongod --dbpath /path/to/data
   ```

2. **Start Redis**
   ```bash
   redis-server
   ```

3. **Start Backend**
   ```bash
   cd backend
   npm run dev
   ```

4. **Start Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

#### Option 3: Full Docker Setup

```bash
docker-compose up -d
```

This will start all services including MongoDB, Redis, Backend, and Frontend.

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/user/register` - Register new user
- `POST /api/user/login` - Login user
- `POST /api/user/logout` - Logout user
- `POST /api/user/refresh-token` - Refresh access token
- `POST /api/user/forgot-password` - Request password reset
- `POST /api/user/reset-password` - Reset password

### User Endpoints
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `POST /api/user/upload-resume` - Upload resume
- `GET /apiuser/resumes` - Get user resumes

### Job Endpoints
- `GET /api/job` - Get all jobs (with filters)
- `GET /api/job/:id` - Get job by ID
- `POST /api/job` - Create new job (recruiter only)
- `PUT /api/job/:id` - Update job (recruiter only)
- `DELETE /api/job/:id` - Delete job (recruiter only)

### Application Endpoints
- `POST /api/application` - Apply for a job
- `GET /api/application` - Get user applications
- `GET /api/application/:id` - Get application by ID
- `PUT /api/application/:id/status` - Update application status

### AI Endpoints
- `POST /api/ai/parse-resume` - Parse resume
- `POST /api/ai/ats-score` - Calculate ATS score
- `POST /api/ai/resume-match` - Match resume to job
- `POST /api/ai/cover-letter` - Generate cover letter
- `POST /api/ai/career-advice` - Get career advice

### Notification Endpoints
- `GET /api/notification` - Get user notifications
- `PUT /api/notification/:id/read` - Mark as read
- `DELETE /api/notification/:id` - Delete notification

### Chat Endpoints
- `GET /api/chat/conversations` - Get conversations
- `POST /api/chat/conversations` - Create conversation
- `POST /api/chat/conversations/:id/messages` - Send message
- `GET /api/chat/conversations/:id/messages` - Get messages

## 🔒 Security Features

- **Helmet**: Security headers
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: Zod schema validation
- **Input Sanitization**: DOMPurify for XSS prevention
- **Protected APIs**: JWT authentication
- **Role-Based Access**: RBAC implementation
- **Secure JWT**: Token expiration and refresh
- **Password Hashing**: bcryptjs for secure passwords
- **CORS**: Configured for specific origins

## 🧪 Testing

```bash
# Run tests
cd backend
npm test

# Run tests in watch mode
npm run test:watch

# Run linting
npm run lint
npm run lint:fix
```

## 📊 Performance Optimization

- **Lazy Loading**: Code splitting with React.lazy
- **Caching**: Redis for frequently accessed data
- **Queue**: Bull for background job processing
- **Image Optimization**: Cloudinary automatic optimization
- **Memoization**: React.memo and useMemo
- **Pagination**: Efficient data loading
- **Database Indexing**: Optimized MongoDB queries

## 🚢 Deployment

### Frontend Deployment (Vercel)

1. Connect your repository to Vercel
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Add environment variables
4. Deploy

### Backend Deployment (Railway/Render)

1. Connect your repository to Railway/Render
2. Configure build settings:
   - Build Command: `cd backend && npm install && npm run build`
   - Start Command: `cd backend && npm start`
3. Add environment variables
4. Deploy

### Docker Deployment

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👥 Team

- **Principal Software Architect & Full Stack Engineer**: AI HireHub Team

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by leading recruitment platforms
- AI-powered features using Gemini/OpenAI APIs
