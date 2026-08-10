// SECURITY NOTE — read this before touching this file.
//
// This module is the ONLY place in the entire app that ever sees a raw
// card number or CVV. It never sends them anywhere — not to our backend,
// not to localStorage, not to analytics. It derives display-safe metadata
// (brand, last 4 digits) and produces a mock opaque "token" standing in
// for what a real payment processor's SDK (e.g. Stripe.js) would return
// from a real tokenization call. Only that token + metadata is ever sent
// to the backend or stored anywhere.
//
// To go live: replace `tokenizeCard` with a real call to your payment
// processor's client-side SDK (e.g. `stripe.createPaymentMethod(...)`).
// Every caller of this function already only handles the returned
// {token, brand, last4} shape, so no other code needs to change.

export interface TokenizedCard {
  token: string;
  brand: string;
  last4: string;
}

function detectBrand(digitsOnly: string): string {
  if (/^4/.test(digitsOnly)) return "Visa";
  if (/^5[1-5]/.test(digitsOnly)) return "Mastercard";
  if (/^3[47]/.test(digitsOnly)) return "Amex";
  if (/^6(?:011|5)/.test(digitsOnly)) return "Discover";
  return "Card";
}

// Luhn checksum — standard card-number validity check.
function passesLuhn(digitsOnly: string): boolean {
  let sum = 0;
  let alt = false;
  for (let i = digitsOnly.length - 1; i >= 0; i--) {
    let n = parseInt(digitsOnly[i], 10);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

export function validateCardNumber(rawNumber: string): boolean {
  const digitsOnly = rawNumber.replace(/\D/g, "");
  return digitsOnly.length >= 13 && digitsOnly.length <= 19 && passesLuhn(digitsOnly);
}

/**
 * Simulates a client-side tokenization call. The raw number/cvv exist only
 * in this function's local scope for the duration of this call.
 */
export async function tokenizeCard(rawNumber: string, _cvv: string): Promise<TokenizedCard> {
  const digitsOnly = rawNumber.replace(/\D/g, "");

  if (!validateCardNumber(digitsOnly)) {
    throw new Error("That card number doesn't look valid.");
  }

  // Simulate the network round-trip a real tokenization call would make.
  await new Promise((resolve) => setTimeout(resolve, 350));

  const brand = detectBrand(digitsOnly);
  const last4 = digitsOnly.slice(-4);
  const token = `mocktok_${crypto.randomUUID()}`;

  // rawNumber and _cvv fall out of scope here and are never referenced
  // again — nothing below this point has access to them.
  return { token, brand, last4 };
}
