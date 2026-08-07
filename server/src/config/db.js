import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // ignore
}

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/agentx";

export async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`[DB] Connected to ${MONGO_URI}`);
  } catch (err) {
    console.error("[DB] MongoDB connection failed:", err.message);
    process.exit(1);
  }
}