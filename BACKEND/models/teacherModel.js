import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String },
    email: { type: String, required: true },
    password: { type: String },
    role: {
      type: String,
      enum: ["teacher", "staff"],
      default: "teacher",
    },
    school: { type: mongoose.Schema.Types.ObjectId, ref: "School" },
    classTeacher: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
    assignedClasses: [
      {
        class: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
        subject: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Teacher", teacherSchema);
