import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import routes from "./routes/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", service: "agentx-api", version: "1.0.0" });
});

app.use("/api", routes);

app.use((err, req, res, next) => {
  console.error("[Server] unhandled:", err.message);
  res.status(500).json({ status: "error", error: err.message });
});

// Serve built React client (production single-port mode)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDist = path.resolve(__dirname, "../../client/dist");
if (fs.existsSync(path.join(clientDist, "index.html"))) {
  app.use(express.static(clientDist));
  app.use((req, res) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      return res.status(405).json({ status: "error", error: "Method not allowed." });
    }
    if (req.path.startsWith("/api")) {
      return res.status(404).json({ status: "error", error: "Not found." });
    }
    res.sendFile(path.join(clientDist, "index.html"));
  });
} else {
  console.log("[Server] client/dist not found — API only mode (run `npm run build` in client/).");
  app.use((req, res) => {
    res.status(404).json({ status: "error", error: "Not found." });
  });
}

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[Server] AgentX API listening on http://localhost:${PORT}`);
  });
});