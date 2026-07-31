import dotenv from "dotenv";
dotenv.config();

import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";

import connectDB from "./utils/db.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";

// Routes
import userRouter from "../routes/user.route.js";
import companyRouter from "../routes/company.route.js";
import jobRouter from "../routes/job.route.js";
import applicationRouter from "../routes/application.route.js";
import savedJobRouter from "../routes/savedJob.route.js";
import analyticsRouter from "../routes/analytics.route.js";
import resumeRouter from "../routes/resume.route.js";
import aiRouter from "../routes/ai.route.js";
import notificationRouter from "./routes/notification.route.js";
import chatRouter from "./routes/chat.route.js";
import interviewRouter from "./routes/interview.route.js";
import adminRouter from "./routes/admin.route.js";

// Socket setup
import { setupSocket } from "./socket/socket.js";

const app: Application = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
});

// Make io globally available
app.set("io", io);

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"),
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// API routes
app.use("/api/user", userRouter);
app.use("/api/company", companyRouter);
app.use("/api/job", jobRouter);
app.use("/api/application", applicationRouter);
app.use("/api/saved-job", savedJobRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/resume", resumeRouter);
app.use("/api/ai", aiRouter);
app.use("/api/notification", notificationRouter);
app.use("/api/chat", chatRouter);
app.use("/api/interview", interviewRouter);
app.use("/api/admin", adminRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "AI HireHub API is running" });
});

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Setup Socket.io
setupSocket(io);

// Start server
const PORT = process.env.PORT || 8000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server is running on port: ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`);
  connectDB();
});

export { app, io };
