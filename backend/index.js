import aiRoute from "./routes/ai.route.js";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import connectDB from "./utils/db.js";
import userRouter from "./routes/user.route.js";
import companyRouter from "./routes/company.route.js";
import jobRouter from "./routes/job.route.js";
import applicationRouter from "./routes/application.route.js";
import savedJobRouter from "./routes/savedJob.route.js";
import analyticsRouter from "./routes/analytics.route.js";
import resumeRouter from "./routes/resume.route.js";
import chatRouter from "./routes/chat.route.js";
import skillAssessmentRouter from "./routes/skillAssessment.route.js";

const app = express();

const __dirname = path.resolve();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
  origin: "http://localhost:5174",
  credentials: true,
};
app.use(cors(corsOptions));

// routes (api's)
app.use("/api/user", userRouter);
app.use("/api/company", companyRouter);
app.use("/api/job", jobRouter);
app.use("/api/application", applicationRouter);
app.use("/api/saved-job", savedJobRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/ai", aiRoute);
app.use("/api/resume", resumeRouter);
app.use("/api/chat", chatRouter);
app.use("/api/assessment", skillAssessmentRouter);

app.use(express.static(path.join(__dirname, "frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port: ${process.env.PORT}`);
  connectDB();
});
