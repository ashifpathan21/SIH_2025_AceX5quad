import mongoose from "mongoose";

const principalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image:{type:String} ,
    email:{type:String , required:true},
    password:{type:String } ,
    employeeId: { type: String, unique: true },
    role:{type:String , default:"principal"} ,
    school: { type: mongoose.Schema.Types.ObjectId, ref: "School" },
  },
  { timestamps: true }
);

export default mongoose.model("Principal", principalSchema);
