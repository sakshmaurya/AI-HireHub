import express from "express";
import {
  checkUser,
  deleteProfilePhoto,
  deleteResume,
  login,
  logout,
  register,
  updateProfile,
  refreshToken,
} from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import {
  multipleUpload,
  singleUpload,
} from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/register", singleUpload, register);
router.post("/login", login);
router.put("/update-profile", protect, multipleUpload, updateProfile);
router.get("/logout", logout);
router.get("/check", protect, checkUser);
router.post("/refresh-token", refreshToken);
router.delete("/delete-profile-photo", protect, deleteProfilePhoto);
router.delete("/delete-resume", protect, deleteResume);

export default router;
