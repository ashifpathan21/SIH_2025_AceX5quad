import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Principal from "../models/principalModel.js";

import { config } from "dotenv";
config();

// ---------------- Govt Creates Principal ----------------
export const createPrincipal = async (req, res) => {
  try {
    const { govKey, name, email, password, employeeId } = req.body;

    // 🔑 check Govt secret key (stored in .env)
    if (govKey !== process.env.GOVT_SECRET) {
      return res
        .status(403)
        .json({ message: "Unauthorized: Invalid Govt key" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const principal = await Principal.create({
      name,
      email,
      password: hashedPassword,
      employeeId,
    });

    res
      .status(201)
      .json({ message: "Principal created successfully", principal });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✏️ Principal updates own profile
export const updatePrincipalProfile = async (req, res) => {
  try {
    const principalId = req.user.id; // JWT से मिला हुआ id
    const { name, image } = req.body;

    const updatedPrincipal = await Principal.findByIdAndUpdate(
      principalId,
      { name, image },
      { new: true, runValidators: true }
    ).select("-password"); // password hide

    if (!updatedPrincipal) {
      return res.status(404).json({ message: "Principal not found" });
    }

    res.status(200).json({
      message: "Principal profile updated successfully",
      principal: updatedPrincipal,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
