import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    options: [{ type: mongoose.Schema.Types.ObjectId, ref: "Option" }],
    correctAnswer: { type: String }, // for written/numeric
    correctOptionIndex: { type: Number }, // for MCQ
    point:{type:Number default:4} 
  },
  { timestamps: true }
);

export default mongoose.model("Question", questionSchema);
