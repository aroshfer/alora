import { JSONFilePreset } from "lowdb/node";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbFile = path.join(__dirname, "..", "..", "data", "db.json");

const defaultData = {
  // Users never store a raw password — only passwordHash (bcrypt).
  // paymentMethods never store a card number or CVV — only a token +
  // display metadata (brand/last4/expiry) produced by client-side
  // "tokenization" (see src/utils/cardBrand.js on the frontend).
  users: [],
  orders: [],
};

export const db = await JSONFilePreset(dbFile, defaultData);

export function findUserByUsernameOrEmail(identifier) {
  const q = identifier.trim().toLowerCase();
  return db.data.users.find((u) => u.username === q || u.email === q);
}

export function findUserById(id) {
  return db.data.users.find((u) => u.id === id);
}

// Strips sensitive/internal fields before a user object is ever sent to the client.
export function toSafeUser(user) {
  if (!user) return null;
  const { passwordHash, ...safe } = user;
  return safe;
}
