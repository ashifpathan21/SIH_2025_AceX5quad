import Class from "../models/classModel.js";
import Student from "../models/studentModel.js";
import School from "../models/schoolModel.js";

// ✅ Get top 5 students per class (based on attendance %)
export const updateClassTopStudents = async (req, res) => {
  try {
    const cls = await Class.findById(req.params.id).populate("students");
    if (!cls) return res.status(404).json({ message: "Class not found" });

    const students = await Student.find({ class: cls._id }).populate(
      "attendance"
    );

    // Calculate attendance %
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

// ✅ Create Class (only principal)
export const createClass = async (req, res) => {
  try {
    const { name, roomNo, schoolId } = req.body;
    if (!name || !schoolId) {
      return res.status(400).json({ message: "Name and schoolId required" });
    }

    const school = await School.findById(schoolId);
    if (!school) return res.status(404).json({ message: "School not found" });

    // Create new class with school ref
    const newClass = await Class.create({ name, roomNo, school: schoolId });

    // Push into school.classes
    school.classes.push(newClass._id);
    await school.save();

    res.status(201).json(newClass);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all Classes
export const getClasses = async (req, res) => {
  try {
    const data = await Class.find().populate(
      "students topStudents classTeacher teachers"
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update Class (principal or teacher)
export const updateClass = async (req, res) => {
  try {
    const cls = await Class.findById(req.params.id);
    if (!cls) return res.status(404).json({ message: "Class not found" });

    const updated = await Class.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("students topStudents classTeacher teachers");

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete Class (only principal)
export const deleteClass = async (req, res) => {
  try {
    const cls = await Class.findById(req.params.id);
    if (!cls) return res.status(404).json({ message: "Class not found" });

    // 🔹 Remove from school's classes[]
    await School.updateOne(
      { classes: cls._id },
      { $pull: { classes: cls._id } }
    );

    await Class.findByIdAndDelete(req.params.id);
    res.json({ message: "Class deleted and removed from school" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
