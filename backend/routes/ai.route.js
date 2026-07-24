import express from "express";
import { 
  analyzeResume, 
  getInterviewQuestions, 
  getRecommendations, 
  generateCoverLetterForJob,
  rankJobCandidates 
} from "../controllers/ai.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Analyze resume with optional job description for matching
router.post("/analyze-resume", protect, analyzeResume);

// Get AI-powered job recommendations for student
router.get("/recommendations", protect, getRecommendations);

// Generate cover letter for a specific job
router.post("/cover-letter/:jobId", protect, generateCoverLetterForJob);

// Generate interview questions for a job (recruiter only)
router.post("/interview-questions/:jobId", protect, getInterviewQuestions);

// Rank candidates for a job (recruiter only)
router.post("/rank-candidates/:jobId", protect, rankJobCandidates);

export default router;