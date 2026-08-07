import { Router } from "express";
import { authGuard } from "../middleware/auth.js";
import agentClient from "../services/agentClient.js";

const router = Router();

// Guarded proxies that read data from the Python agent service (mock store lives there)
const PROXY_GETS = [
  "health",
  "students",
  "events",
  "internships",
  "scholarships",
  "transport",
  "faqs",
  "grievances",
  "actionlog",
];

PROXY_GETS.forEach((name) => {
  router.get(`/${name}`, authGuard, async (req, res) => {
    try {
      const { data } = await agentClient.get(`/${name}`);
      res.json(data);
    } catch (err) {
      res.status(502).json({ status: "error", error: "Agent service unavailable.", detail: err.message });
    }
  });
});

// POST /api/hitl/respond
router.post("/hitl/respond", authGuard, async (req, res) => {
  try {
    const { draft_id, action } = req.body;
    const { data } = await agentClient.post("/hitl/respond", { draft_id, action });
    res.json(data);
  } catch (err) {
    res.status(502).json({ status: "error", error: "Agent service unavailable.", detail: err.message });
  }
});

export default router;