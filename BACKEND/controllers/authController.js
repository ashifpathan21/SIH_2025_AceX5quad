import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Principal from "../models/principalModel.js";
import Teacher from "../models/teacherModel.js";
import Student from "../models/studentModel.js";
import {config } from "dotenv" ;
config() 





// 🔑 Utility for token
const generateToken = (id, role , school , classTeacher) => {
  return jwt.sign({ id, role , school ,classTeacher}, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// ---------------- Principal ----------------
export const principalLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const principal = await Principal.findOne({ email }).populate({
      path: "school",
      populate: {
        path: "classes", // Populate all classes in the school
        populate: {
          path: "students teachers classTeacher topStudents",
        },
      },
    });

    if (!principal)
      return res.status(404).json({ message: "Principal not found" });

    const isMatch = await bcrypt.compare(password, principal.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(principal._id, "principal" , principal?.school);
    let update = principal ;
    update.password = null 
    res.json({ token, role: "principal", principal:update  });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- Teacher ----------------
export const teacherLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const teacher = await Teacher.findOne({ email });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(teacher._id, "teacher" , teacher?.school , teacher?.classTeacher);
    let updateTeacher = teacher 
    updateTeacher.password = null ;
    res.json({ token, role: "teacher", teacher:updateTeacher });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- Student ----------------
export const studentLogin = async (req, res) => {
  try {
    const { rollNumber, password } = req.body;
    const student = await Student.findOne({ rollNumber });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(student._id, "student" , student?.school );
    let update = student 
    update.password = null 
    res.json({ token, role: "student", student:update });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
