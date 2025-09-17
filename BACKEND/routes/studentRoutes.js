import express from "express";
import {
  createStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/studentController.js";
import { studentLogin } from "../controllers/authController.js";
import {
  authMiddleware,
  isPrincipal,
  isTeacher,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🔹 Student login
router.post("/login", studentLogin);

// 🔹 Create student (only principal)
router.post(
  "/create",
  authMiddleware,
  (req, res, next) => {
    if (req.user.role === "principal" || req.user.role === "teacher") {
      next();
    } else {
      return res
        .status(403)
        .json({ message: "Only teachers/principals allowed" });
    }
  },
  createStudent
);

// 🔹 Get all students
//    - Principal → by school
//    - Teacher → by their assigned classes
router.get("/getAll", authMiddleware, getStudents);

// 🔹 Get one student by ID
router.get("/get/:id", authMiddleware, getStudent);

// 🔹 Update student
//    (we’ll handle role-specific update logic in controller)
router.put("/update/:id", authMiddleware, updateStudent);

// 🔹 Delete student (only teacher or principal allowed)
router.delete(
  "/delete/:id",
  authMiddleware,
  (req, res, next) => {
    if (req.user.role === "principal" || req.user.role === "teacher") {
      next();
    } else {
      return res
        .status(403)
        .json({ message: "Only teachers/principals allowed" });
    }
  },
  deleteStudent
);

export default router;
