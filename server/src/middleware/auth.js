import jwt from "jsonwebtoken";
import { findUserById, toSafeUser } from "../db.js";

const JWT_SECRET = process.env.JWT_SECRET;

export function requireAuth(req, res, next) {
  const token = req.cookies?.session;
  if (!token) return res.status(401).json({ error: "Not authenticated." });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = findUserById(payload.sub);
    if (!user) return res.status(401).json({ error: "Not authenticated." });
    req.user = toSafeUser(user);
    next();
  } catch {
    return res.status(401).json({ error: "Session expired or invalid." });
  }
}

export function issueSessionCookie(res, userId) {
  const token = jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: "7d" });
  res.cookie("session", token, {
    httpOnly: true, // not readable by JS — mitigates XSS token theft
    sameSite: "lax", // sent on top-level navigation, blocked on cross-site POSTs
    secure: process.env.COOKIE_SECURE === "true",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

export function clearSessionCookie(res) {
  res.clearCookie("session", { path: "/" });
}
