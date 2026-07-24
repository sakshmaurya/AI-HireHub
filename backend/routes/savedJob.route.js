import express from "express";
import {
  checkSavedJob,
  deleteSavedJob,
  getSavedJobs,
  saveJob,
  updateSavedJob,
} from "../controllers/savedJob.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/save", protect, saveJob);
router.get("/get", protect, getSavedJobs);
router.put("/update/:id", protect, updateSavedJob);
router.delete("/delete/:id", protect, deleteSavedJob);
router.get("/check/:jobId", protect, checkSavedJob);

export default router;
