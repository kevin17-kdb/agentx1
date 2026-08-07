import { Router } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { authGuard, signToken } from "../middleware/auth.js";

const router = Router();

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const uid = String(req.body.uid || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(401).json({ status: "error", error: "Invalid UID or password." });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ status: "error", error: "Invalid UID or password." });
    }

    const token = signToken(user);
    res.json({
      status: "success",
      token,
      user: {
        uid: user.uid,
        name: user.name,
        studentId: user.studentId,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

// POST /api/auth/logout  (stateless — client discards the token)
router.post("/logout", (req, res) => {
  res.json({ status: "success", message: "Logged out." });
});

// GET /api/auth/me
router.get("/me", authGuard, async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid }).lean();
    if (!user) {
      return res.status(401).json({ status: "error", error: "User no longer exists." });
    }
    res.json({
      status: "success",
      user: { uid: user.uid, name: user.name, studentId: user.studentId, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

export default router;