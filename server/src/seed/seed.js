import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const USERS = [
  { uid: "chen", name: "Alex Chen", studentId: "S101", role: "student", password: "chen@2026" },
  { uid: "priya", name: "Priya Patel", studentId: "S102", role: "student", password: "priya@2026" },
  { uid: "rahul", name: "Rahul Nair", studentId: "S103", role: "student", password: "rahul@2026" },
  { uid: "admin", name: "System Admin", studentId: "S101", role: "admin", password: "admin@2026" },
];

async function seed() {
  await connectDB();
  for (const u of USERS) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    await User.findOneAndUpdate(
      { uid: u.uid },
      { name: u.name, studentId: u.studentId, role: u.role, passwordHash },
      { upsert: true, returnDocument: "after" }
    );
    console.log(`[Seed] upserted ${u.uid} (${u.name})`);
  }
  await mongoose.connection.close();
  console.log("[Seed] done.");
}

seed().catch((err) => {
  console.error("[Seed] failed:", err.message);
  process.exit(1);
});