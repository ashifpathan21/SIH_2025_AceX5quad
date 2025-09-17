import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g. "10th A"
    roomNo: { type: String },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    school: { type: mongoose.Schema.Types.ObjectId, ref: "School" },
    classTeacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
    teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Teacher" }],
    topStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  },
  { timestamps: true }
);

export default mongoose.model("Class", classSchema);
