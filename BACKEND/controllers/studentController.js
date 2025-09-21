import bcrypt from "bcrypt";
import Student from "../models/studentModel.js";
import Class from "../models/classModel.js";
import Teacher from "../models/teacherModel.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

// ✅ helper function to sanitize student object
const sanitizeStudent = (student) => {
  if (!student) return null;
  const obj = student.toObject();
  delete obj.password;
  return obj;
};

// ✅ Create Student (only principal)
export const createStudent = async (req, res) => {
  try {
    const {
      name,
      rollNumber,
      password,
      RFID,
      classId,
      parentsContact,
      schoolId,
    } = req.body;

    if (!name || !rollNumber || !password || !classId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await Student.findOne({ rollNumber });
    if (existing) {
      return res.status(400).json({ message: "Roll number already exists" });
    }

    let imageUrl = null;
    let imageId = null;
    if (req.file) {
      const uploadRes = await uploadToCloudinary(req.file.buffer, "upload");
      imageUrl = uploadRes.secure_url;
      imageId = uploadRes.public_id;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({
      name,
      rollNumber,
      password: hashedPassword,
      image: imageUrl,
      imageId,
      RFID,
      parentsContact,
      class: classId,
      school: schoolId,
    });

    await Class.findByIdAndUpdate(classId, {
      $push: { students: student._id },
    });

    res.status(201).json({
      message: "Student created successfully",
      student: sanitizeStudent(student),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update Student
export const updateStudent = async (req, res) => {
  try {
    const { name, password, RFID, rollNumber, parentsContact, classId } =
      req.body;

    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // restrictions (same as your code)
    if (
      req.user.role === "principal" &&
      student.school.toString() !== req.user.school
    ) {
      return res.status(403).json({ message: "Not your school student" });
    }
    if (req.user.role === "teacher") {
      const teacher = await Teacher.findById(req.user.id).populate(
        "assignedClasses.class"
      );
      const classIds = teacher.assignedClasses.map((c) =>
        c.class._id.toString()
      );
      if (!classIds.includes(student.class.toString())) {
        return res.status(403).json({ message: "Not your class student" });
      }
    }
    if (req.user.role === "student" && req.user.id !== student._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (name) student.name = name;
    if (rollNumber) student.rollNumber = rollNumber;
    if (RFID) student.RFID = RFID;
    if (parentsContact) student.parentsContact = parentsContact;
    if (password) student.password = await bcrypt.hash(password, 10);

    // image update
    if (req.file) {
      const uploadRes = await uploadToCloudinary(req.file.buffer, "upload");
      student.image = uploadRes.secure_url;
      student.imageId = uploadRes.public_id;
    }

    // class change
    if (classId && classId !== student.class.toString()) {
      await Class.findByIdAndUpdate(student.class, {
        $pull: { students: student._id },
      });
      student.class = classId;
      await Class.findByIdAndUpdate(classId, {
        $push: { students: student._id },
      });
    }

    await student.save();

    res.json({
      message: "Student updated successfully",
      student: sanitizeStudent(student),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get all students
export const getStudents = async (req, res) => {
  try {
    let students;

    if (req.user.role === "principal") {
      console.log("principal extracting ");
      console.log(req.user.school);
      students = await Student.find({ school: req.user.school })
        .populate("class", "name roomNo")
        .populate("school", "name");
      console.log(students.length);
    } else if (req.user.role === "teacher") {
      const teacher = await Teacher.findById(req.user.id).populate(
        "assignedClasses.class"
      );
      const classIds = teacher.assignedClasses.map((c) => c.class._id);

      students = await Student.find({ class: { $in: classIds } })
        .populate("class", "name roomNo")
        .populate("school", "name");
    } else {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(students.map(sanitizeStudent));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get one student by ID
export const getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate("class", "name roomNo")
      .populate("school", "name");

    if (!student) return res.status(404).json({ message: "Student not found" });

    // restrictions
    if (
      req.user.role === "principal" &&
      student.school.toString() !== req.user.school
    ) {
      return res.status(403).json({ message: "Not your school student" });
    }
    if (req.user.role === "teacher") {
      const teacher = await Teacher.findById(req.user.id).populate(
        "assignedClasses.class"
      );
      const classIds = teacher.assignedClasses.map((c) =>
        c.class._id.toString()
      );
      if (!classIds.includes(student.class.toString())) {
        return res.status(403).json({ message: "Not your class student" });
      }
    }
    if (req.user.role === "student" && req.user.id !== student._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    res.json(sanitizeStudent(student));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Principal restriction
    if (
      req.user.role === "principal" &&
      student.school.toString() !== req.user.school._id.toString()
    ) {
      return res.status(403).json({ message: "Not your school student" });
    }

    // Teacher restriction (only classTeacher class)
    if (req.user.role === "teacher") {
      const teacher = await Teacher.findById(req.user.id);

      // अगर teacher के classTeacher से match नहीं करता तो block कर दो
      if (
        !teacher.classTeacher ||
        teacher.classTeacher.toString() !== student.class.toString()
      ) {
        return res.status(403).json({ message: "Not your class student" });
      }
    }

    // Delete student image from Cloudinary if exists
    if (student.imageId) {
      await deleteFromCloudinary(student.imageId);
    }

    // Remove student from Class.students array
    await Class.findByIdAndUpdate(student.class, {
      $pull: { students: student._id },
    });

    // Delete student document
    await Student.findByIdAndDelete(req.params.id);

    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
};