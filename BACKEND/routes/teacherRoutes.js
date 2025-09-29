import express from "express";
import { teacherLogin } from "../controllers/authController.js";

import {
  createTeacher,
  getTeachers,
  getTeacher,
  updateTeacher,
  deleteTeacher,
  getTeacherHomeData,
} from "../controllers/teacherController.js";

import {
  authMiddleware,
  isPrincipal,
  isTeacher,
} from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

router.post("/login", teacherLogin);

// ✅ Create teacher (only principal)
router.post(
  "/create",
  authMiddleware,
  isPrincipal,
  upload.single("image"),
  createTeacher
);

// ✅ Get all teachers (principal only for management)
router.get("/getAll", authMiddleware, isPrincipal, getTeachers);
router.get("/getData", authMiddleware, isTeacher , getTeacherHomeData);

// ✅ Get one teacher by ID (principal or teacher self)
router.get("/get/:id", authMiddleware, getTeacher);

// ✅ Update teacher (principal or teacher self)
router.put(
  "/update/:id",
  authMiddleware,
  upload.single("image"),
  updateTeacher
);

// ✅ Delete teacher (only principal)
router.delete("/delete/:id", authMiddleware, isPrincipal, deleteTeacher);

export default router;
