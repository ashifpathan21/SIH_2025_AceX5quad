import express from "express";
import {
  createFoodMenu,
  getFoodMenu,
  deleteFoodMenu,
} from "../controllers/foodMenuController.js";


import {
  authMiddleware,
  isPrincipal,
  isTeacher,
} from "../middlewares/authMiddleware.js";


const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  (req, res, next) => {
    if (req.user.role === "principal" || req.user.role === "teacher") {
      return createFoodMenu(req, res);
    }
    return res.status(403).json({ message: "Unauthorized to create menu" });
  } 
);
router.get("/getAll",authMiddleware , getFoodMenu);
router.delete("/delete/:id", authMiddleware , (req, res, next) => {
    if (req.user.role === "principal" || req.user.role === "teacher") {
      return deleteFoodMenu(req, res);
    }
    return res.status(403).json({ message: "Unauthorized to delete menu" });
  }  );

export default router;
