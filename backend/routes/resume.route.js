import express from "express";
import {
  createResume,
  getUserResumes,
  getResumeById,
  updateResume,
  deleteResume,
  setDefaultResume,
  getTemplates,
  getTemplateById,
  duplicateResume,
} from "../controllers/resume.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Resume CRUD operations
router.post("/create", protect, createResume);
router.get("/all", protect, getUserResumes);
router.get("/:resumeId", protect, getResumeById);
router.put("/:resumeId", protect, updateResume);
router.delete("/:resumeId", protect, deleteResume);
router.post("/:resumeId/duplicate", protect, duplicateResume);
router.post("/:resumeId/set-default", protect, setDefaultResume);

// Template operations
router.get("/templates/all", protect, getTemplates);
router.get("/templates/:templateId", protect, getTemplateById);

export default router;
