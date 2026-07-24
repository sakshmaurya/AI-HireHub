import express from "express";
import {
  getAdminAnalytics,
  getRecruiterAnalytics,
  getStudentAnalytics,
} from "../controllers/analytics.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/student", protect, getStudentAnalytics);
router.get("/recruiter", protect, getRecruiterAnalytics);
router.get("/admin", protect, getAdminAnalytics);

export default router;
