import { Router } from "express";
import { v4 as uuid } from "uuid";
import { db, findUserById, toSafeUser } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { isNonEmptyString } from "../utils/validators.js";

const router = Router();
router.use(requireAuth);

router.get("/", (req, res) => {
  res.json({ user: req.user });
});

router.put("/", async (req, res) => {
  const user = findUserById(req.user.id);
  const { fullName, phone } = req.body ?? {};

  if (fullName !== undefined) {
    if (!isNonEmptyString(fullName, 100)) return res.status(400).json({ error: "Enter a valid name." });
    user.fullName = fullName.trim();
  }
  if (phone !== undefined) {
    if (typeof phone !== "string" || phone.length > 30) return res.status(400).json({ error: "Enter a valid phone number." });
    user.phone = phone.trim();
  }

  await db.write();
  res.json({ user: toSafeUser(user) });
});

/* ---------------------------- addresses ---------------------------- */

router.post("/addresses", async (req, res) => {
  const user = findUserById(req.user.id);
  const { label, line1, line2, city, postalCode, country } = req.body ?? {};

  if (!isNonEmptyString(line1, 120) || !isNonEmptyString(city, 80) || !isNonEmptyString(country, 80)) {
    return res.status(400).json({ error: "Address line, city, and country are required." });
  }

  const address = {
    id: uuid(),
    label: isNonEmptyString(label, 40) ? label.trim() : "Address",
    line1: line1.trim(),
    line2: typeof line2 === "string" ? line2.trim() : "",
    city: city.trim(),
    postalCode: typeof postalCode === "string" ? postalCode.trim() : "",
    country: country.trim(),
    isDefault: user.addresses.length === 0,
  };

  user.addresses.push(address);
  await db.write();
  res.status(201).json({ user: toSafeUser(user) });
});

router.delete("/addresses/:id", async (req, res) => {
  const user = findUserById(req.user.id);
  user.addresses = user.addresses.filter((a) => a.id !== req.params.id);
  await db.write();
  res.json({ user: toSafeUser(user) });
});

/* ------------------------- payment methods -------------------------- */
//
// IMPORTANT: this endpoint never receives or stores a full card number or
// CVV. The frontend "tokenizes" the card client-side (see
// src/utils/cardBrand.ts) — only a mock token plus display metadata
// (brand, last 4 digits, expiry) is ever sent here. A real production app
// would replace the mock tokenizer with a real one (Stripe.js, etc.) and
// this endpoint would remain unchanged, since it never touches raw PANs.

router.post("/payment-methods", async (req, res) => {
  const user = findUserById(req.user.id);
  const { token, brand, last4, expMonth, expYear, cardholderName } = req.body ?? {};

  if (!isNonEmptyString(token, 200) || !isNonEmptyString(brand, 30) || !/^\d{4}$/.test(String(last4))) {
    return res.status(400).json({ error: "Invalid payment method data." });
  }
  const month = Number(expMonth);
  const year = Number(expYear);
  if (!Number.isInteger(month) || month < 1 || month > 12 || !Number.isInteger(year) || year < new Date().getFullYear()) {
    return res.status(400).json({ error: "Invalid expiry date." });
  }

  const method = {
    id: uuid(),
    token, // opaque reference to the mock "vault" — not a real PAN
    brand: brand.trim(),
    last4: String(last4),
    expMonth: month,
    expYear: year,
    cardholderName: isNonEmptyString(cardholderName, 100) ? cardholderName.trim() : "",
    isDefault: user.paymentMethods.length === 0,
  };

  user.paymentMethods.push(method);
  await db.write();
  res.status(201).json({ user: toSafeUser(user) });
});

router.delete("/payment-methods/:id", async (req, res) => {
  const user = findUserById(req.user.id);
  user.paymentMethods = user.paymentMethods.filter((m) => m.id !== req.params.id);
  await db.write();
  res.json({ user: toSafeUser(user) });
});

export default router;
