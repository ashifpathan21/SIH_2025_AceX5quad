import Class from "../models/classModel.js";
import Student from "../models/studentModel.js";
import Teacher from "../models/teacherModel.js";
import School from "../models/schoolModel.js";

// ✅ Get top 5 students per class
export const updateClassTopStudents = async (req, res) => {
  try {
    const cls = await Class.findById(req.params.id).populate("students");
    if (!cls) return res.status(404).json({ message: "Class not found" });

    const students = await Student.find({ class: cls._id }).populate(
      "attendance"
    );

    const ranked = students.map((s) => {
      const total = s.attendance.length;
      const present = s.attendance.filter((a) => a.status === "Present").length;
      const percent = total ? (present / total) * 100 : 0;
      return { id: s._id, percent };
    });

    ranked.sort((a, b) => b.percent - a.percent);
    const topIds = ranked.slice(0, 5).map((r) => r.id);

    cls.topStudents = topIds;
    await cls.save();

    res.json({ message: "Top students updated", topStudents: topIds });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Create Class
export const createClass = async (req, res) => {
  try {
    const { name, roomNo, teachers = [], classTeacher } = req.body;
    const schoolId = req.user.school;

    if (!name || !schoolId) {
      return res.status(400).json({ message: "Name and schoolId required" });
    }

    const school = await School.findById(schoolId);
    if (!school) return res.status(404).json({ message: "School not found" });

    const newClass = await Class.create({
      name,
      roomNo,
      school: schoolId,
      teachers: [],
      classTeacher: classTeacher || null,
    });

    // 🔗 Bind teachers (two-way)
    for (const t of teachers) {
      const teacherDoc = await Teacher.findById(t.teacher);
      if (
        !teacherDoc.assignedClasses.some(
          (a) =>
            a.class.toString() === newClass._id.toString() &&
            a.subject === t.subject
        )
      ) {
        teacherDoc.assignedClasses.push({
          class: newClass._id,
          subject: t.subject,
        });
        await teacherDoc.save();
      }

      if (
        !newClass.teachers.some(
          (ct) =>
            ct.teacher.toString() === t.teacher.toString() &&
            ct.subject === t.subject
        )
      ) {
        newClass.teachers.push(t);
      }
    }

    // 🔗 Bind classTeacher
    if (classTeacher) {
      await Teacher.findByIdAndUpdate(classTeacher, {
        classTeacher: newClass._id,
      });
    }

    // 🔗 Push class to school
    school.classes.push(newClass._id);
    await school.save();
    await newClass.save();

    res.status(201).json(newClass);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all Classes
export const getClasses = async (req, res) => {
  try {
    const data = await Class.find().populate({
      path: "students topStudents classTeacher teachers.teacher",
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update Class
export const updateClass = async (req, res) => {
  try {
    const { teachers = [], classTeacher } = req.body;

    const cls = await Class.findById(req.params.id);
    if (!cls) return res.status(404).json({ message: "Class not found" });

    // remove old teacher links
    for (const t of cls.teachers) {
      await Teacher.findByIdAndUpdate(t.teacher, {
        $pull: { assignedClasses: { class: cls._id, subject: t.subject } },
      });
    }

    cls.teachers = [];

    // add new teachers (two-way)
    for (const t of teachers) {
      const teacherDoc = await Teacher.findById(t.teacher);
      if (
        !teacherDoc.assignedClasses.some(
          (a) =>
            a.class.toString() === cls._id.toString() && a.subject === t.subject
        )
      ) {
        teacherDoc.assignedClasses.push({
          class: cls._id,
          subject: t.subject,
        });
        await teacherDoc.save();
      }

      if (
        !cls.teachers.some(
          (ct) =>
            ct.teacher.toString() === t.teacher.toString() &&
            ct.subject === t.subject
        )
      ) {
        cls.teachers.push(t);
      }
    }

    // update classTeacher
    if (classTeacher) {
      if (cls.classTeacher && cls.classTeacher.toString() !== classTeacher) {
        await Teacher.findByIdAndUpdate(cls.classTeacher, {
          $unset: { classTeacher: "" },
        });
      }
      cls.classTeacher = classTeacher;
      await Teacher.findByIdAndUpdate(classTeacher, {
        classTeacher: cls._id,
      });
    }

    await cls.save();

    const updated = await Class.findById(cls._id).populate(
      "students topStudents classTeacher teachers.teacher"
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete Class
export const deleteClass = async (req, res) => {
  try {
    const cls = await Class.findById(req.params.id);
    if (!cls) return res.status(404).json({ message: "Class not found" });

    // 🔹 Remove from school's classes[]
    await School.updateOne(
      { classes: cls._id },
      { $pull: { classes: cls._id } }
    );

    // 🔹 Remove class from all teachers
    await Teacher.updateMany(
      { "assignedClasses.class": cls._id },
      { $pull: { assignedClasses: { class: cls._id } } }
    );

    // 🔹 Reset classTeacher for any teacher
    await Teacher.updateMany(
      { classTeacher: cls._id },
      { $unset: { classTeacher: "" } }
    );

    // 🔹 Delete class
    await Class.findByIdAndDelete(req.params.id);

    res.json({ message: "Class deleted and references cleaned" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
