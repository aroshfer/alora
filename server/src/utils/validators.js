const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_RE = /^[a-zA-Z0-9_.-]{3,24}$/;

export function isValidEmail(value) {
  return typeof value === "string" && EMAIL_RE.test(value.trim());
}

export function isValidUsername(value) {
  return typeof value === "string" && USERNAME_RE.test(value.trim());
}

// Minimum bar: 8+ chars, at least one letter and one number.
// (Real products should also check against breached-password lists —
// out of scope for this demo.)
export function isStrongPassword(value) {
  if (typeof value !== "string" || value.length < 8) return false;
  return /[a-zA-Z]/.test(value) && /[0-9]/.test(value);
}

export function isNonEmptyString(value, maxLen = 200) {
  return typeof value === "string" && value.trim().length > 0 && value.length <= maxLen;
}
