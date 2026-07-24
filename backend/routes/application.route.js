import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  applyJob,
  getApplicants,
  getAppliedJobs,
  updateStatus,
} from "../controllers/application.controller.js";

const router = express.Router();

router.get("/apply/:id", protect, applyJob);
router.get("/get", protect, getAppliedJobs);
router.get("/:id/applicants", protect, getApplicants);
router.post("/update-status/:id", protect, updateStatus);

export default router;
