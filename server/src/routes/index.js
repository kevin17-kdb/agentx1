import { Router } from "express";
import authRoutes from "./auth.js";
import chatRoutes from "./chat.js";
import ragRoutes from "./rag.js";
import miscRoutes from "./misc.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/", chatRoutes);
router.use("/", ragRoutes);
router.use("/", miscRoutes);

export default router;