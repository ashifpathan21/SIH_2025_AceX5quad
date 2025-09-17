import express from "express";
import {
  createSchool,
  getSchools,
  updateSchool,
  updateSchoolTopStudents,
} from "../controllers/schoolController.js";

import { authMiddleware, isPrincipal } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ Principal creates a school
router.post("/create", authMiddleware, isPrincipal, createSchool);

// ✅ CRUD
router.get("/get", getSchools);
router.put("/update/:id", authMiddleware, isPrincipal, updateSchool);
router.put("/updateTopStudent/:id", authMiddleware, isPrincipal, updateSchoolTopStudents);


export default router;
