import express from "express";
import {
  createClass,
  getClasses,
  updateClass,
  deleteClass,
  updateClassTopStudents,
} from "../controllers/classController.js";

import {
  authMiddleware,
  isPrincipal,
  isTeacher,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ Only principal can create class
router.post("/create", authMiddleware, isPrincipal, createClass);

// ✅ Anyone logged in (principal/teacher/student) can view classes
router.get("/get", authMiddleware, getClasses);

// ✅ Principal or Teacher can update class
router.put("/update/:id", authMiddleware, (req, res, next) => {
  if (req.user.role === "principal" || req.user.role === "teacher") {
    return updateClass(req, res);
  }
  return res.status(403).json({ message: "Unauthorized to update class" });
});

// ✅ Only principal can delete class
router.delete("/delete/:id", authMiddleware, isPrincipal, deleteClass);

// ✅ Only teacher can update top students of class
router.put(
  "/updateTopStudents/:id",
  authMiddleware,
  isTeacher,
  updateClassTopStudents
);

export default router;
