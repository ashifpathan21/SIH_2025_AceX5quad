import bcrypt from "bcrypt";
import Teacher from "../models/teacherModel.js";
import Class from "../models/classModel.js";
import School from "../models/schoolModel.js";
import Student from "../models/studentModel.js";
import Attendance from "../models/attendanceModel.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

// ✅ helper function to sanitize teacher object
const sanitizeTeacher = (teacher) => {
  if (!teacher) return null;
  const obj = teacher.toObject();
  delete obj.password;
  return obj;
};

// ✅ Create Teacher
export const createTeacher = async (req, res) => {
  try {
    const { name, email, password, classTeacher } = req.body;
    let assignedClasses = [];
    const school = req.user.school;

    if (req.body.assignedClasses) {
      assignedClasses = JSON.parse(req.body.assignedClasses);
    }

    if (!name || !email || !password || !school) {
      return res
        .status(400)
        .json({ message: "Name, email, password and school are required" });
    }

    const existing = await Teacher.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    let imageUrl = null;
    let imageId = null;
    if (req.file) {
      const uploadRes = await uploadToCloudinary(req.file.buffer, "teachers");
      imageUrl = uploadRes.secure_url;
      imageId = uploadRes.public_id;
    }

    const teacher = await Teacher.create({
      name,
      email,
      password: hashedPassword,
      image: imageUrl,
      imageId,
      classTeacher,
      assignedClasses: [],
      school,
    });

    // 🔗 Update school.teachers[]
    await School.findByIdAndUpdate(school, {
      $push: { teachers: teacher._id },
    });

    // 🔗 Class teacher assignment
    if (classTeacher) {
      await Class.findByIdAndUpdate(classTeacher, {
        classTeacher: teacher._id,
      });
    }

    // 🔗 Assign classes (two-way + no duplicate)
    for (const cls of assignedClasses) {
      const classDoc = await Class.findById(cls.class);
      if (
        !classDoc.teachers.some(
          (t) =>
            t.teacher.toString() === teacher._id.toString() &&
            t.subject === cls.subject
        )
      ) {
        classDoc.teachers.push({ teacher: teacher._id, subject: cls.subject });
        await classDoc.save();
      }

      teacher.assignedClasses.push({
        class: cls.class,
        subject: cls.subject,
      });
    }

    await teacher.save();

    res.status(201).json({
      message: "Teacher created successfully",
      teacher: sanitizeTeacher(teacher),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update Teacher
export const updateTeacher = async (req, res) => {
  try {
    const { name, email, password, classTeacher } = req.body;
    let assignedClasses = [];
    const school = req.user.school;

    if (req.body.assignedClasses) {
      assignedClasses = JSON.parse(req.body.assignedClasses);
    }

    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    if (name) teacher.name = name;
    if (email) teacher.email = email;
    if (password) teacher.password = await bcrypt.hash(password, 10);

    // 🔄 Handle image update
    if (req.file) {
      if (teacher.imageId) await deleteFromCloudinary(teacher.imageId);
      const uploadRes = await uploadToCloudinary(req.file.buffer, "teachers");
      teacher.image = uploadRes.secure_url;
      teacher.imageId = uploadRes.public_id;
    }

    // 🔄 Handle school change
    if (school && teacher.school.toString() !== school) {
      await School.findByIdAndUpdate(teacher.school, {
        $pull: { teachers: teacher._id },
      });
      teacher.school = school;
      await School.findByIdAndUpdate(school, {
        $addToSet: { teachers: teacher._id },
      });
    }

    // 🔄 Update classTeacher
    if (classTeacher) {
      if (
        teacher.classTeacher &&
        teacher.classTeacher.toString() !== classTeacher
      ) {
        await Class.findByIdAndUpdate(teacher.classTeacher, {
          $unset: { classTeacher: "" },
        });
      }
      teacher.classTeacher = classTeacher;
      await Class.findByIdAndUpdate(classTeacher, {
        classTeacher: teacher._id,
      });
    }

    // 🔄 Update assignedClasses (reset + rebind two-way)
    if (assignedClasses) {
      // remove from old
      for (const cls of teacher.assignedClasses) {
        await Class.findByIdAndUpdate(cls.class, {
          $pull: { teachers: { teacher: teacher._id, subject: cls.subject } },
        });
      }

      teacher.assignedClasses = [];

      // add to new
      for (const cls of assignedClasses) {
        const classDoc = await Class.findById(cls.class);

        if (
          !classDoc?.teachers.some(
            (t) =>
              t.teacher.toString() === teacher._id.toString() &&
              t.subject === cls.subject
          )
        ) {
          classDoc?.teachers.push({
            teacher: teacher._id,
            subject: cls.subject,
          });
          await classDoc.save();
        }

        teacher.assignedClasses.push({
          class: cls.class,
          subject: cls.subject,
        });
      }
    }

    await teacher.save();

    res.json({
      message: "Teacher updated successfully",
      teacher: sanitizeTeacher(teacher),
    });
  } catch (err) {
    //console.log(err)
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete Teacher
export const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    // 🔹 Delete profile image
    if (teacher.imageId) await deleteFromCloudinary(teacher.imageId);

    // 🔹 Remove from school
    await School.findByIdAndUpdate(teacher.school, {
      $pull: { teachers: teacher._id },
    });

    // 🔹 Remove from classTeacher
    if (teacher.classTeacher) {
      await Class.findByIdAndUpdate(teacher.classTeacher, {
        $unset: { classTeacher: "" },
      });
    }

    // 🔹 Remove from assignedClasses
    for (const cls of teacher.assignedClasses) {
      await Class.findByIdAndUpdate(cls.class, {
        $pull: { teachers: { teacher: teacher._id, subject: cls.subject } },
      });
    }

    await Teacher.findByIdAndDelete(req.params.id);

    res.json({ message: "Teacher deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get all teachers
export const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find()
      .populate("school", "name")
      .populate("classTeacher", "name roomNo")
      .populate("assignedClasses.class", "name roomNo");

    res.json(teachers.map(sanitizeTeacher));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get one teacher
export const getTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate("school", "name")
      .populate("classTeacher", "name roomNo")
      .populate("assignedClasses.class", "name roomNo");

    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    res.json(sanitizeTeacher(teacher));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getTeacherHomeData = async (req, res) => {
  try {
    console.log("here")
    const teacherId = req.user.id;

    // 1. Find teacher and populate classTeacher
    const teacher = await Teacher.findById(teacherId)
      .populate("school")
      .populate({
        path: "classTeacher",
        populate: { path: "students", select: "name image rollNumber" },
      });

    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    if (!teacher.classTeacher)
      return res
        .status(404)
        .json({ message: "No assigned class for this teacher" });

    const classInfo = teacher.classTeacher;
    const students = classInfo.students || [];
    const studentIds = students.map((s) => s._id);

    // 2. Fetch attendance for students in this class
    const today = new Date();
    const todayStart = new Date(today);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);

    const PERIOD_DAYS = 7;
    const rangeStart = new Date(todayStart);
    rangeStart.setDate(rangeStart.getDate() - (PERIOD_DAYS - 1));

    const attendanceRecords = await Attendance.find({
      student: { $in: studentIds },
      class: classInfo._id,
      date: { $gte: rangeStart, $lte: todayEnd },
    }).lean();

    // 3. Prepare stats
    const perDatePresent = new Map();
    const perStudentStats = new Map();

    const toDateKey = (d) => new Date(d).toISOString().split("T")[0];
    const todayKey = toDateKey(todayStart);

    for (const st of students) {
      perStudentStats.set(st._id.toString(), {
        name: st.name,
        image: st.image,
        presentCount: 0,
        recordCount: 0,
      });
    }

    for (const rec of attendanceRecords) {
      const sid = rec.student.toString();
      const dateKey = toDateKey(rec.date);

      if (!perDatePresent.has(dateKey)) perDatePresent.set(dateKey, new Set());
      if (rec.status === "Present") perDatePresent.get(dateKey).add(sid);

      if (perStudentStats.has(sid)) {
        const stats = perStudentStats.get(sid);
        stats.recordCount++;
        if (rec.status === "Present") stats.presentCount++;
      }
    }

    // Today's attendance rate
    const presentToday = (perDatePresent.get(todayKey) || new Set()).size;
    const totalStudents = students.length;
    const attendanceRate =
      totalStudents > 0 ? Math.round((presentToday / totalStudents) * 100) : 0;

    // Attendance trend
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
      attendanceTrend.push({
        date: key,
        present: presentCount,
        total: totalStudents,
        rate,
      });
    }

    // Top students
    const topStudents = Array.from(perStudentStats.entries())
      .map(([id, stats]) => ({
        id,
        name: stats.name,
        image: stats.image,
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
      .slice(0, 5); // Top 5

    // Final response
    const dashboardData = {
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        image: teacher.image,
        school: teacher.school,
      },
      classInfo: {
        id: classInfo._id,
        name: classInfo.name,
        totalStudents,
      },
      stats: {
        totalStudents,
        attendanceRate,
      },
      attendanceTrend,
      topStudents,
      students: students.map((st) => {
        const stats = perStudentStats.get(st._id.toString());
        return {
          ...st,
          attendanceStats: {
            totalDays: stats.recordCount,
            presentDays: stats.presentCount,
            absentDays: stats.recordCount - stats.presentCount,
            percentage: stats.recordCount
              ? Math.round((stats.presentCount / stats.recordCount) * 100)
              : 0,
          },
        };
      }),
    };

    res.status(200).json(dashboardData);
  } catch (error) {
    console.error("❌ getTeacherHomeData error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};