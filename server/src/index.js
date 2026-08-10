import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import ordersRoutes from "./routes/checkout.js";

if (!process.env.JWT_SECRET || process.env.JWT_SECRET === "replace-this-with-a-long-random-string") {
  console.error(
    "\n✗ JWT_SECRET is missing or still set to the placeholder value.\n" +
      "  Copy server/.env.example to server/.env and set a real random secret before starting the server.\n"
  );
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(helmet());
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true, // required so the browser sends/accepts the session cookie
  })
);
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());

// Lightweight CSRF mitigation: our frontend always sends this header on
// state-changing requests (see src/utils/api.ts). A cross-site form post
// or simple <img>/<script> exfiltration attempt can't set custom headers,
// so requests without it are rejected for anything that isn't a plain GET.
app.use((req, res, next) => {
  if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS") return next();
  if (req.get("X-Requested-With") !== "AloraClient") {
    return res.status(403).json({ error: "Request rejected." });
  }
  next();
});

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/orders", ordersRoutes);

app.use((req, res) => res.status(404).json({ error: "Not found." }));

// Centralized error handler — never leak stack traces to the client.
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong." });
});

app.listen(PORT, () => {
  console.log(`Alora API listening on http://localhost:${PORT}`);
});
