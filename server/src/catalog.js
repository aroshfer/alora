// This mirrors src/data/products.ts on the frontend. It exists so the
// server can independently verify prices and stock at checkout time —
// never trusting whatever price/subtotal the client sends. If a request
// tampers with prices in the browser (devtools, intercepted requests,
// etc.), the server-computed total below is what actually gets charged.

export const CATALOG = {
  1: { name: "Marine Radiance Collagen Powder 201g", price: 12100, soldOut: false },
  2: { name: "Amalfi Hand Cream Duo, 2 × 30ml", price: 4290, soldOut: false },
  3: { name: "Citrus Bloom Invigorating Shower Gel", price: 3490, soldOut: false },
  4: { name: "Oat Milk Daily Moisture Body Wash 1L", price: 6780, soldOut: false },
  5: { name: "Niacinamide 10% + Zinc Serum 30ml", price: 5250, soldOut: false },
  6: { name: "Glow Acid 7% Toning Solution", price: 6500, soldOut: false },
  7: { name: "Azelaic Bright 10% Suspension 30ml", price: 7650, soldOut: true },
  8: { name: "Salicylic Clarity Cleanser 237ml", price: 9480, soldOut: false },
  9: { name: "Centella Calm Serum 30ml", price: 8050, soldOut: false },
  10: { name: "Blemish Control Face Cleanser 236ml", price: 9350, soldOut: false },
  11: { name: "Everyday Salicylic Solution 2%", price: 7500, soldOut: false },
  12: { name: "Tone-Even Capsule Cream 75ml", price: 8150, soldOut: false },
  13: { name: "Weightless Mineral Fluid SPF50+ 50ml", price: 7980, soldOut: false },
  14: { name: "Cedar & Amber Fragrance Spray 100ml", price: 11200, soldOut: false },
};
