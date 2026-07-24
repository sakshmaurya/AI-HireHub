import express from "express";
import {
  deleteCompany,
  getCompany,
  getCompanyById,
  registerCompany,
  updateCompany,
} from "../controllers/company.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { singleUpload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/register", protect, registerCompany);
router.get("/get", protect, getCompany);
router.get("/get/:id", protect, getCompanyById);
router.put("/update/:id", protect, singleUpload, updateCompany);
router.delete("/delete-company", protect, deleteCompany);

export default router;
