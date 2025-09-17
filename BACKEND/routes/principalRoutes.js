import express from "express";
import { principalLogin } from "../controllers/authController.js";

import {
  createPrincipal,
  updatePrincipalProfile,
  getPrincipalProfile,
  getPrincipalDashboard,
} from "../controllers/principalController.js";
import {
  authMiddleware,
  isPrincipal,
} from "../middlewares/authMiddleware.js";


const router = express.Router();

// ---------------- Login ----------------
router.post("/login", principalLogin);
// Govt creates Principal
router.post("/create-principal", createPrincipal);
router.put("/update-principal" , authMiddleware , isPrincipal , updatePrincipalProfile)
router.get("/profile" , authMiddleware , isPrincipal ,  getPrincipalProfile);
router.get("/dashboard", authMiddleware, isPrincipal, getPrincipalDashboard);



export default router;
