import mongoose from "mongoose";

const schoolSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String },
    principal: { type: mongoose.Schema.Types.ObjectId, ref: "Principal" },
    classes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
    topStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Teacher" }],
  },
  { timestamps: true }
);

export default mongoose.model("School", schoolSchema);
