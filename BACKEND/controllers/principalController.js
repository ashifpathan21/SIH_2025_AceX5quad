import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Principal from "../models/principalModel.js";
import Attendance from "../models/attendanceModel.js";
import ClassModel from "../models/classModel.js";
import Student from "../models/studentModel.js";
import Teacher from "../models/teacherModel.js";
import { config } from "dotenv";
config();



// Get Principal Profile from Token
export const getPrincipalProfile = async (req, res) => {
  try {
    // token is attached in auth middleware, decoded user is in req.user
    const principalId = req.user.id;
    console.log("working" , principalId)
    const principal = await Principal.findById(principalId)
      .select("-password") // Exclude password
      .populate({
        path: "school",
        populate: {
          path: "classes", // Populate all classes in the school
          populate:{
            path:"students teachers classTeacher topStudents"
          }
        },
      });
    if (!principal) {
      return res.status(404).json({ success: false, message: "Principal not found" });
    }

    res.status(200).json({
      success: true,
      principal,
    });
  } catch (error) {
    console.error("Error fetching principal profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


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


export const getPrincipalDashboard = async (req, res) => {
  try {
    const principalId = req.user.id;
    const principal = await Principal.findById(principalId)
      .select("-password")
      .populate({
        path: "school",
        populate: {
          path: "classes",
          populate: [
            { path: "students", select: "name image rollNumber" },
            { path: "classTeacher", select: "name" },
            { path: "teachers.teacher", select: "name" }, // ⚡️ teacher inside object
          ],
        },
      })
      .populate("school.teachers", "name");

    if (!principal) {
      return res.status(404).json({ message: "Principal not found" });
    }

    const classes = principal.school?.classes || [];
    const totalClasses = classes.length;

    // Flatten all students + map studentId → className
    const studentList = [];
    const studentToClassMap = new Map();
    for (const cls of classes) {
      for (const st of cls.students || []) {
        studentList.push(st);
        studentToClassMap.set(st._id.toString(), cls.name);
      }
    }

    const totalStudents = studentList.length;
    const totalTeachers = principal.school?.teachers?.length || 0;

    // Dates setup
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    const PERIOD_DAYS = 7; // last 7 days trend
    const rangeStart = new Date(todayStart);
    rangeStart.setDate(rangeStart.getDate() - (PERIOD_DAYS - 1));

    // Fetch attendance for all students in this school within range
    const studentIds = studentList.map((s) => s._id);
    const attendanceRecords = await Attendance.find({
      student: { $in: studentIds },
      date: { $gte: rangeStart, $lte: todayEnd },
    }).select("student class status date");

    // Aggregation helpers
    const perDatePresent = new Map(); // dateKey → Set of present studentIds
    const perStudentStats = new Map(); // studentId → { presentCount, recordCount, name, image }
    const perClassTodayPresent = new Map(); // classId → Set of present studentIds

    const toDateKey = (d) => new Date(d).toISOString().split("T")[0];
    const todayKey = toDateKey(todayStart);

    // Init students in stats
    for (const st of studentList) {
      perStudentStats.set(st._id.toString(), {
        name: st.name,
        image: st.image,
        presentCount: 0,
        recordCount: 0,
      });
    }

    // Process attendance records
    for (const rec of attendanceRecords) {
      const sid = rec.student.toString();
      const dateKey = toDateKey(rec.date);

      if (!perDatePresent.has(dateKey)) perDatePresent.set(dateKey, new Set());
      if (rec.status === "Present") perDatePresent.get(dateKey).add(sid);

      // Per-student stats
      if (perStudentStats.has(sid)) {
        const stats = perStudentStats.get(sid);
        stats.recordCount++;
        if (rec.status === "Present") stats.presentCount++;
      }

      // Today's per-class
      if (dateKey === todayKey && rec.status === "Present") {
        const classId = rec.class?.toString();
        if (classId) {
          if (!perClassTodayPresent.has(classId))
            perClassTodayPresent.set(classId, new Set());
          perClassTodayPresent.get(classId).add(sid);
        }
      }
    }

    // Today's attendance rate
    const presentToday = (perDatePresent.get(todayKey) || new Set()).size;
    const attendanceRate =
      totalStudents > 0 ? Math.round((presentToday / totalStudents) * 100) : 0;

    // Attendance trend (last 7 days)
    const attendanceTrend = [];
    for (let i = PERIOD_DAYS - 1; i >= 0; i--) {
      const d = new Date(todayStart);
      d.setDate(d.getDate() - i);
      const key = toDateKey(d);
      const presentCount = (perDatePresent.get(key) || new Set()).size;
      const rate =
        totalStudents > 0
          ? Math.round((presentCount / totalStudents) * 100)
          : 0;
      attendanceTrend.push({ date: key, rate });
    }

    // Top students
    const topStudents = Array.from(perStudentStats.entries())
      .map(([id, stats]) => ({
        id,
        name: stats.name,
        image: stats.image,
        class: studentToClassMap.get(id),
        totalClassesAttended: stats.presentCount,
        totalClasses: stats.recordCount,
        attendancePercentage: stats.recordCount
          ? Math.round((stats.presentCount / stats.recordCount) * 100)
          : 0,
      }))
      .sort(
        (a, b) =>
          b.attendancePercentage - a.attendancePercentage ||
          b.totalClassesAttended - a.totalClassesAttended
      )
      .slice(0, 5);

    // Class-wise attendance (today)
    const classAttendance = classes.map((cls) => {
      const studentsCount = (cls.students || []).length;
      const presentCount = (
        perClassTodayPresent.get(cls._id.toString()) || new Set()
      ).size;
      return {
        className: cls.name,
        attendanceRate:
          studentsCount > 0
            ? Math.round((presentCount / studentsCount) * 100)
            : 0,
        presentCount,
        totalStudents: studentsCount,
      };
    });

    // Final response
    const dashboardData = {
      stats: {
        totalStudents,
        totalClasses,
        totalTeachers,
        attendanceRate,
      },
      attendanceTrend,
      topStudents,
      classAttendance,
    };

    res.status(200).json(dashboardData);
  } catch (error) {
    console.error("❌ getPrincipalDashboard error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};