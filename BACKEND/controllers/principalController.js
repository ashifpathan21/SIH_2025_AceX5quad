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
    const principalId = req.user.id; // assuming JWT middleware sets req.principal
    const principal = await Principal.findById(principalId)
      .select("-password")
      .populate({
        path: "school",
        populate: {
          path: "classes",
          populate: [
            {
              path: "students",
            },
            {
              path: "teachers",
            },
            {
              path: "classTeacher",
            },
          ],
        },
      })
      .populate("school.teachers");

    if (!principal) {
      return res.status(404).json({ message: "Principal not found" });
    }

    const classes = principal.school.classes || [];
    const totalClasses = classes.length;

    // Count total students
    const totalStudents = classes.reduce(
      (acc, cls) => acc + (cls.students?.length || 0),
      0
    );

    // Count total teachers
    const totalTeachers = principal.school.teachers?.length || 0;

    // Calculate today's attendance rate
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let attendedToday = 0;
    let totalPossibleToday = 0;

    for (const cls of classes) {
      for (const student of cls.students || []) {
        const attendanceRecord = await Attendance.findOne({
          student: student._id,
          date: today,
        });

        totalPossibleToday++;
        if (attendanceRecord?.status === "present") attendedToday++;
      }
    }

    const attendanceRate =
      totalPossibleToday > 0
        ? Math.round((attendedToday / totalPossibleToday) * 100)
        : 0;

    // Inside getPrincipalDashboard function, after calculating today's attendanceRate

    const attendanceTrend = [];
    

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() - i);
      currentDate.setHours(0, 0, 0, 0);

      let attendedCount = 0;
      let totalCount = 0;

      for (const cls of classes) {
        for (const student of cls.students || []) {
          const attendanceRecord = await Attendance.findOne({
            student: student._id,
            date: currentDate,
          });
          totalCount++;
          if (attendanceRecord?.status === "present") {
            attendedCount++;
          }
        }
      }

      const dailyAttendanceRate =
        totalCount > 0 ? Math.round((attendedCount / totalCount) * 100) : 0;
      attendanceTrend.push({
        date: currentDate.toISOString().split("T")[0], // Format date as YYYY-MM-DD
        rate: dailyAttendanceRate,
      });
    }
    // Reverse to get chronological order (oldest to newest)
    attendanceTrend.reverse();

    // Inside getPrincipalDashboard function, after attendanceTrend calculation

    const studentAttendanceMap = new Map();

    // Initialize map with all students
    for (const cls of classes) {
      for (const student of cls.students || []) {
        studentAttendanceMap.set(student._id.toString(), {
          name: student.name,
          image:student.image,
          totalClassesAttended: 0,
          totalClasses: 0,
          class:cls.name
        });
      }
    }

    // Iterate through attendance records to populate counts
    // You might need to fetch all attendance records for the relevant period
    // For simplicity, this example assumes attendance records are available and can be queried efficiently.
    // A more robust solution might involve querying attendance for a specific date range.
    const allAttendanceRecords = await Attendance.find({
      student: { $in: Array.from(studentAttendanceMap.keys()).map((id) => id) }, // This part needs refinement to get student IDs correctly
      // Add date range if necessary: date: { $gte: sevenDaysAgo, $lte: today }
    });

    for (const record of allAttendanceRecords) {
      const studentId = record.student.toString();
      if (studentAttendanceMap.has(studentId)) {
        const studentData = studentAttendanceMap.get(studentId);
        studentData.totalClasses++;
        if (record.status === "present") {
          studentData.totalClassesAttended++;
        }
      }
    }

    const topStudents = Array.from(studentAttendanceMap.values())
      .map((student) => ({
        ...student,
        attendancePercentage:
          student.totalClasses > 0
            ? Math.round(
                (student.totalClassesAttended / student.totalClasses) * 100
              )
            : 0,
      }))
      .sort((a, b) => b.attendancePercentage - a.attendancePercentage) // Sort by attendance descending
      .slice(0, 5); // Get top 5 students

    // Inside getPrincipalDashboard function, after topStudents calculation

    const classAttendance = [];

    for (const cls of classes) {
      let attendedCount = 0;
      let totalCount = 0;

      for (const student of cls.students || []) {
        const attendanceRecord = await Attendance.findOne({
          student: student._id,
          date: today,
        });
        totalCount++;
        if (attendanceRecord?.status === "present") {
          attendedCount++;
        }
      }

      const dailyAttendanceRate =
        totalCount > 0 ? Math.round((attendedCount / totalCount) * 100) : 0;

      classAttendance.push({
        className: cls.name,
        attendanceRate: dailyAttendanceRate,
      });
    }

    // Build dashboard response
    const dashboardData = {
      stats: {
        totalStudents,
        totalClasses,
        totalTeachers,
        attendanceRate,
      },
      attendanceTrend, // You can calculate last 7 days attendance
      topStudents, // Sort students by attendance or marks
      classAttendance // Attendance per class
          };

    res.status(200).json(dashboardData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};