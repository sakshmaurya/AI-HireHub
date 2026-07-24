import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  deleteJob,
  getAllJobs,
  getJobById,
  getRecruiterJobs,
  postJob,
} from "../controllers/job.controller.js";

const router = express.Router();

router.post("/post", protect, postJob);
router.get("/get", getAllJobs); // public route, no protect middleware
router.get("/get/:id", protect, getJobById);
router.get("/get-recruiter-jobs", protect, getRecruiterJobs);
router.delete("/delete/:id", protect, deleteJob);

export default router;
