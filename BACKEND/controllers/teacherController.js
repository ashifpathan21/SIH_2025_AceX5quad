import bcrypt from "bcrypt";
import Teacher from "../models/teacherModel.js";
import Class from "../models/classModel.js";
import School from "../models/schoolModel.js";
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

// ✅ Create Teacher (only principal)
export const createTeacher = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      classTeacher,
      assignedClasses = [],
    } = req.body;
    const school = req.user.school;

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
      assignedClasses,
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

    // 🔗 Add to assigned classes
    if (assignedClasses?.length) {
      for (const cls of assignedClasses) {
        await Class.findByIdAndUpdate(cls.class, {
          $addToSet: { teachers: teacher._id },
        });
      }
    }

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
    const { name, email, password, classTeacher, assignedClasses } = req.body;
    const school = req.user.school;

    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    if (name) teacher.name = name;
    if (email) teacher.email = email;
    if (password) teacher.password = await bcrypt.hash(password, 10);

    // 🔄 Handle image update
    if (req.file) {
      // delete old image
      if (teacher.imageId) {
        await deleteFromCloudinary(teacher.imageId);
      }
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

    // 🔄 Update assignedClasses
    if (assignedClasses) {
      // remove teacher from old
      for (const cls of teacher.assignedClasses) {
        await Class.findByIdAndUpdate(cls.class, {
          $pull: { teachers: teacher._id },
        });
      }
      teacher.assignedClasses = assignedClasses;

      // add to new
      for (const cls of assignedClasses) {
        await Class.findByIdAndUpdate(cls.class, {
          $addToSet: { teachers: teacher._id },
        });
      }
    }

    await teacher.save();

    res.json({
      message: "Teacher updated successfully",
      teacher: sanitizeTeacher(teacher),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete Teacher
export const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    // 🔹 Delete profile image from Cloudinary
    if (teacher.imageId) {
      await deleteFromCloudinary(teacher.imageId);
    }

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

    // 🔹 Remove from assigned classes
    for (const cls of teacher.assignedClasses) {
      await Class.findByIdAndUpdate(cls.class, {
        $pull: { teachers: teacher._id },
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

// ✅ Get one teacher by ID
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
