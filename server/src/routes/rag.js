import { Router } from "express";
import { authGuard } from "../middleware/auth.js";
import agentClient from "../services/agentClient.js";

const router = Router();

// POST /api/rag/search
router.post("/rag/search", authGuard, async (req, res) => {
  try {
    const query = String(req.body.query || "");
    const top_k = Number(req.body.top_k || 3);

    const { data } = await agentClient.post("/rag/search", { query, top_k });
    res.json(data);
  } catch (err) {
    res.status(502).json({ status: "error", error: "Agent service unavailable.", detail: err.message });
  }
});

export default router;