import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rollNumber: { type: String, required: true, unique: true },
    password:{type:String} ,
    class: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
    school:{type:mongoose.Schema.Types.ObjectId , ref:"School"},
    RFID: { type: String, unique: true },
    image: { type: String }, // for face recognition 
    parentsContact: {
      fatherName: { type: String },
      motherName: { type: String },
      contact: { type: String },
    },
    attendance: [{ type: mongoose.Schema.Types.ObjectId, ref: "Attendance" }],
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
