import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true },
    studentId: { type: String, required: true },
    role: { type: String, default: "student" },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);