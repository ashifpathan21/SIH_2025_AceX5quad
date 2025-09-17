import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    class: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
    date: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["Present", "Absent"],
      required: true,
      default:"Absent"
    },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
  },
  { timestamps: true }
);

export default mongoose.model("Attendance", attendanceSchema);
