import Attendance from "../models/attendanceModel.js";
import Student from "../models/studentModel.js";
import Class from "../models/classModel.js";
import School from "../models/schoolModel.js";
import {sendSMS} from '../utils/sms.js'
// ✅ Utility: Rank students by attendance %
const rankStudents = (students, limit = 5) => {
  const ranked = students.map((s) => {
    const total = s.attendance.length;
    const present = s.attendance.filter((a) => a.status === "Present").length;
    const percent = total ? (present / total) * 100 : 0;
    return { id: s._id, percent };
  });

  ranked.sort((a, b) => b.percent - a.percent);
  return ranked.slice(0, limit).map((r) => r.id);
};

// ✅ Mark Attendance (teacher → only own class)
export const markAttendance = async (req, res) => {
  try {
    const { presentStudents } = req.body;

    if (!Array.isArray(presentStudents)) {
      return res
        .status(400)
        .json({ message: "presentStudents must be an array" });
    }

    // Teacher must be class teacher
    const classId = req.user.classTeacher;
    if (!classId) {
      return res
        .status(403)
        .json({ message: "You are not assigned as a class teacher" });
    }

    const cls = await Class.findById(classId);
    if (!cls) return res.status(404).json({ message: "Class not found" });

    // Get all students of class
    const allStudents = await Student.find({ class: classId }).select("-password");
    if (!allStudents.length) {
      return res.status(400).json({ message: "No students in this class" });
    }

    // Mark attendance (present/absent)
    const attendanceRecords = [];
    for (let student of allStudents) {
      const status = presentStudents.includes(student._id.toString())
        ? "Present"
        : "Absent";

      const attendance = await Attendance.create({
        student: student._id,
        class: classId,
        status,
        markedBy: req.user.id,
      });
      if (status == "Present") {
        await sendSMS(
          student?.parentsContact?.contact,
          `प्रिय अभिभावक, आपका बच्चा, ${student.name} आज स्कूल में है।`
        );
      } else {
        await sendSMS(
          student?.parentsContact?.contact,
          `प्रिय अभिभावक,

          हमें सूचित करना पड़ रहा है कि आज आपका बच्चा  ${student.name} स्कूल में उपस्थित नहीं है। कृपया सुनिश्चित करें कि वे स्कूल आएं                     
 और अपनी पढ़ाई पर ध्यान दें, क्योंकि उनका भविष्य इसी पर निर्भर करता है।

           धन्यवाद! `
        );
      }
      await Student.findByIdAndUpdate(student._id, {
        $push: { attendance: attendance._id },
      });

      attendanceRecords.push(attendance);
    }

    res.json({
      message: "Attendance marked successfully ✅",
      count: attendanceRecords.length,
    });
  } catch (error) {
    console.error("❌ Error marking attendance:", error);
    res
      .status(500)
      .json({ message: "Error marking attendance", error: error.message });
  }
};

// ✅ Get Attendance (role-based)
export const getAttendance = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "teacher") {
      filter.class = req.user.classTeacher;
    } else if (req.user.role === "principal") {
      const school = await School.findById(req.user.school).populate("classes");
      if (!school) return res.status(404).json({ message: "School not found" });
      filter.class = { $in: school.classes.map((c) => c._id) };
    } else if (req.user.role === "student") {
      filter.student = req.user.id;
    } else {
      return res.status(403).json({ message: "Unauthorized role" });
    }

    const data = await Attendance.find(filter).populate(
      "student class markedBy"
    );
    res.json(data);
  } catch (error) {
    console.error("❌ Error fetchiang attendance:", error);
    res
      .status(500)
      .json({ message: "Error fetching attendance", error: error.message });
  }
};

// ✅ Update Class Top Students (teacher only)
export const updateClassTopStudentsController = async (req, res) => {
  try {
    const classId = req.user.classTeacher;
    if (!classId) {
      return res
        .status(403)
        .json({ message: "You are not assigned as a class teacher" });
    }

    const students = await Student.find({ class: classId }).populate(
      "attendance"
    );
    if (!students.length) {
      return res.status(400).json({ message: "No students found in class" });
    }

    const topIds = rankStudents(students, 5);
    await Class.findByIdAndUpdate(classId, { topStudents: topIds });

    res.json({ message: "Class top students updated ✅", topStudents: topIds });
  } catch (error) {
    console.error("❌ Error updating class top students:", error);
    res.status(500).json({
      message: "Error updating class top students",
      error: error.message,
    });
  }
};

// ✅ Update School Top Students (principal only)
export const updateSchoolTopStudentsController = async (req, res) => {
  try {
    const schoolId = req.user.school;
    const school = await School.findById(schoolId).populate("classes");
    if (!school) return res.status(404).json({ message: "School not found" });

    let allStudents = [];
    for (let c of school.classes) {
      const students = await Student.find({ class: c }).populate("attendance");
      allStudents.push(...students);
    }

    if (!allStudents.length) {
      return res.status(400).json({ message: "No students found in school" });
    }

    const topIds = rankStudents(allStudents, 5);
    await School.findByIdAndUpdate(schoolId, { topStudents: topIds });

    res.json({
      message: "School top students updated ✅",
      topStudents: topIds,
    });
  } catch (error) {
    console.error("❌ Error updating school top students:", error);
    res.status(500).json({
      message: "Error updating school top students",
      error: error.message,
    });
  }
};
