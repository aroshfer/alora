import { Router } from "express";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import { db, findUserByUsernameOrEmail, toSafeUser } from "../db.js";
import { issueSessionCookie, clearSessionCookie, requireAuth } from "../middleware/auth.js";
import { loginRateLimit, clearLoginAttempts } from "../middleware/rateLimit.js";
import { isValidEmail, isValidUsername, isStrongPassword, isNonEmptyString } from "../utils/validators.js";

const router = Router();
const HASH_ROUNDS = 12;

router.post("/signup", async (req, res) => {
  const { username, email, password, fullName, phone } = req.body ?? {};

  if (!isValidUsername(username)) {
    return res.status(400).json({ error: "Username must be 3-24 characters (letters, numbers, . _ -)." });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Enter a valid email address." });
  }
  if (!isStrongPassword(password)) {
    return res.status(400).json({ error: "Password must be at least 8 characters and include a letter and a number." });
  }
  if (!isNonEmptyString(fullName, 100)) {
    return res.status(400).json({ error: "Enter your full name." });
  }

  const normalizedUsername = username.trim().toLowerCase();
  const normalizedEmail = email.trim().toLowerCase();

  if (findUserByUsernameOrEmail(normalizedUsername) || findUserByUsernameOrEmail(normalizedEmail)) {
    // Deliberately generic — don't reveal which field collided (avoids
    // helping an attacker enumerate valid accounts).
    return res.status(409).json({ error: "An account with that username or email already exists." });
  }

  const passwordHash = await bcrypt.hash(password, HASH_ROUNDS);

  const user = {
    id: uuid(),
    username: normalizedUsername,
    email: normalizedEmail,
    passwordHash,
    fullName: fullName.trim(),
    phone: typeof phone === "string" ? phone.trim() : "",
    addresses: [],
    paymentMethods: [],
    createdAt: new Date().toISOString(),
  };

  db.data.users.push(user);
  await db.write();

  issueSessionCookie(res, user.id);
  res.status(201).json({ user: toSafeUser(user) });
});

router.post("/login", loginRateLimit, async (req, res) => {
  const { identifier, password } = req.body ?? {};

  if (!isNonEmptyString(identifier) || !isNonEmptyString(password)) {
    return res.status(400).json({ error: "Enter your username/email and password." });
  }

  const user = findUserByUsernameOrEmail(identifier);
  // Same generic error whether the account doesn't exist or the password
  // is wrong — prevents attackers from using this endpoint to enumerate
  // valid usernames/emails.
  const genericError = () => res.status(401).json({ error: "Incorrect username/email or password." });

  if (!user) return genericError();

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return genericError();

  clearLoginAttempts(req);
  issueSessionCookie(res, user.id);
  res.json({ user: toSafeUser(user) });
});

router.post("/logout", (_req, res) => {
  clearSessionCookie(res);
  res.status(204).end();
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

export default router;
