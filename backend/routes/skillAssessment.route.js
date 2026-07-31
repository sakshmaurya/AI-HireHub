import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  createAssessment,
  getAllAssessments,
  getAssessmentById,
  submitAssessment,
  getUserResults,
  deleteAssessment
} from "../controllers/skillAssessment.controller.js";

const router = express.Router();

// Public routes
router.get("/all", getAllAssessments);
router.get("/:id", protect, getAssessmentById);

// Protected routes
router.post("/create", protect, createAssessment);
router.post("/:id/submit", protect, submitAssessment);
router.get("/my-results", protect, getUserResults);
router.delete("/:id", protect, deleteAssessment);

export default router;
