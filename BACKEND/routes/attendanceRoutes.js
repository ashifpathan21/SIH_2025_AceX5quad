import express from "express";
import {
  markAttendance,
  getAttendance,
  updateClassTopStudentsController,
  updateSchoolTopStudentsController,
} from "../controllers/attendanceController.js";
import {
  authMiddleware,
  isTeacher,
  isPrincipal,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ Mark attendance (teacher only)
router.post("/mark", authMiddleware, isTeacher, markAttendance);

// ✅ Get attendance (role based: teacher, principal, student)
router.get("/get", authMiddleware, getAttendance);

// ✅ Update class top students (teacher only)
router.post(
  "/update/class-top",
  authMiddleware,
  isTeacher,
  updateClassTopStudentsController
);

// ✅ Update school top students (principal only)
router.post(
  "/update/school-top",
  authMiddleware,
  isPrincipal,
  updateSchoolTopStudentsController
);

export default router;
