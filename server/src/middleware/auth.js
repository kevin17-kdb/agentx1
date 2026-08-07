import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "agentx_dev_secret_change_later";

export function signToken(user) {
  return jwt.sign(
    { uid: user.uid, studentId: user.studentId, role: user.role },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
}

export function authGuard(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ status: "error", error: "Missing auth token." });
  }
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch (err) {
    return res.status(401).json({ status: "error", error: "Invalid or expired token." });
  }
}