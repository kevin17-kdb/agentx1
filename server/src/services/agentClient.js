import axios from "axios";

const agentClient = axios.create({
  baseURL: process.env.AGENT_SERVICE_URL || "http://localhost:8100",
  timeout: 30000,
});

export default agentClient;