import School from "../models/schoolModel.js";
import Student from "../models/studentModel.js";
import Principal from "../models/principalModel.js";

// ✅ Principal can update top students of *their* school only
export const updateSchoolTopStudents = async (req, res) => {
  try {
    const principalId = req.user.id; // ✅ from auth middleware
    const { schoolId } = req.params;

    // ✅ Check principal exists
    const principal = await Principal.findById(principalId);
    if (!principal) {
      return res.status(404).json({ message: "Principal not found" });
    }

    // ✅ Check school exists
    const school = await School.findById(schoolId).populate("classes");
    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }

    // ✅ Ownership check
    if (String(school.principal) !== String(principalId)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this school" });
    }

    // ✅ Collect students from all classes
    let allStudents = [];
    for (let cls of school.classes) {
      const students = await Student.find({ class: cls }).populate(
        "attendance"
      );
      allStudents = [...allStudents, ...students];
    }

    // ✅ Rank by attendance %
    const ranked = allStudents.map((s) => {
      const total = s.attendance.length;
      const present = s.attendance.filter((a) => a.status === "Present").length;
      const percent = total ? (present / total) * 100 : 0;
      return { id: s._id, percent };
    });

    ranked.sort((a, b) => b.percent - a.percent);
    const topIds = ranked.slice(0, 5).map((r) => r.id);

    // ✅ Save in school
    school.topStudents = topIds;
    await school.save();

    res.json({ message: "Top students updated", topStudents: topIds });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const createSchool = async (req, res) => {
  try {
    const { name, address } = req.body;

    // logged in user is principal
    if (req.user.role !== "principal") {
      return res
        .status(403)
        .json({ message: "Only principals can create school" });
    }

    // find principal
    const principal = await Principal.findById(req.user.id);
    if (!principal) {
      return res.status(404).json({ message: "Principal not found" });
    }

    // check if already has a school
    if (principal.school) {
      return res
        .status(400)
        .json({ message: "Principal already has a school" });
    }

    // create new school
    const newSchool = await School.create({
      name,
      address,
      principal: principal._id,
    });

    // link back to principal
    principal.school = newSchool._id;
    await principal.save();

    res.status(201).json(newSchool);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getSchools = async (req, res) => {
  try {
    const data = await School.find()
      .populate({
        path: "principal",
        select: "name email role", // ✅ only safe fields
      })
      .populate({
        path: "classes",
        populate: [
          { path: "classTeacher", select: "name email role" },
          { path: "teachers", select: "name email role" },
          { path: "students", select: "name rollNo" },
          { path: "topStudents", select: "name rollNo" },
        ],
      })
      .populate({
        path: "topStudents",
        select: "name rollNo", // ✅ no sensitive info
      });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const updateSchool = async (req, res) => {
  try {
    const principalId = req.user.id; // ✅ auth middleware से मिलेगा
    const { id } = req.params;

    // ✅ Principal check
    const principal = await Principal.findById(principalId);
    if (!principal) {
      return res.status(404).json({ message: "Principal not found" });
    }

    // ✅ School check
    const school = await School.findById(id);
    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }

    // ✅ Ensure this school belongs to the logged-in principal
    if (String(school.principal) !== String(principalId)) {
      return res
        .status(403)
        .json({ message: "You can only update your own school" });
    }

    // ✅ Validate body fields
    const { name, address } = req.body;
    let updateData = {};

    if (name) {
      if (typeof name !== "string" || name.trim().length < 3) {
        return res
          .status(400)
          .json({ message: "Valid school name is required (min 3 chars)" });
      }
      updateData.name = name.trim();
    }

    if (address !== undefined) {
      if (address && typeof address !== "string") {
        return res
          .status(400)
          .json({ message: "Address must be a string if provided" });
      }
      updateData.address = address ? address.trim() : "";
    }

    // ✅ Update school
    const updated = await School.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



