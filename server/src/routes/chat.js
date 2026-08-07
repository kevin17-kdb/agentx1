import { Router } from "express";
import { authGuard } from "../middleware/auth.js";
import agentClient from "../services/agentClient.js";

const router = Router();

// POST /api/chat  (JWT protected, proxies to Python agent service)
router.post("/chat", authGuard, async (req, res) => {
  try {
    const query = String(req.body.query || "");
    const studentId = req.user.studentId || "S101";

    const { data } = await agentClient.post("/chat", { query, student_id: studentId });
    res.json(data);
  } catch (err) {
    res.status(502).json({ status: "error", error: "Agent service unavailable.", detail: err.message });
  }
});

export default router;