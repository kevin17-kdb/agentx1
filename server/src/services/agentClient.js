import axios from "axios";

const agentClient = axios.create({
  baseURL: process.env.AGENT_SERVICE_URL || "http://127.0.0.1:8100",
  timeout: 30000,
});

export default agentClient;