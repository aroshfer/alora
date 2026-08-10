// In-memory only — resets on server restart, and doesn't share state across
// multiple server instances. Fine for a single-process dev/demo deployment;
// a real production deployment should use a shared store (e.g. Redis).

const attempts = new Map(); // key -> { count, firstAttemptAt }

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 8;

export function loginRateLimit(req, res, next) {
  const key = `${req.ip}:${(req.body?.identifier || "").toLowerCase()}`;
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || now - entry.firstAttemptAt > WINDOW_MS) {
    attempts.set(key, { count: 1, firstAttemptAt: now });
    return next();
  }

  if (entry.count >= MAX_ATTEMPTS) {
    const retryAfterSec = Math.ceil((WINDOW_MS - (now - entry.firstAttemptAt)) / 1000);
    res.set("Retry-After", String(retryAfterSec));
    return res.status(429).json({ error: "Too many login attempts. Try again later." });
  }

  entry.count += 1;
  next();
}

// Call this after a successful login to reset the counter for that key.
export function clearLoginAttempts(req) {
  const key = `${req.ip}:${(req.body?.identifier || "").toLowerCase()}`;
  attempts.delete(key);
}
