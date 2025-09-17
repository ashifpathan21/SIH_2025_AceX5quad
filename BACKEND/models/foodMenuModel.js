import mongoose from "mongoose";

const foodMenuSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    items: [{ type: String }],
    school: { type: mongoose.Schema.Types.ObjectId, ref: "School" },
  },
  { timestamps: true }
);

export default mongoose.model("FoodMenu", foodMenuSchema);
