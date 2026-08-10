import { Flower2, Droplet, Wind, Leaf, Sparkles, FlaskConical } from "lucide-react";
import type { Product } from "../types";

export const PRODUCTS: Product[] = [
  { id: 1, name: "Marine Radiance Collagen Powder 201g", cat: "vitamins", price: 12100, old: null, rating: 5.0, reviews: 18, tag: "new", icon: FlaskConical, theme: "sage" },
  { id: 2, name: "Amalfi Hand Cream Duo, 2 × 30ml", cat: "body", price: 4290, old: null, rating: 4.8, reviews: 9, tag: "new", icon: Leaf, theme: "blush" },
  { id: 3, name: "Citrus Bloom Invigorating Shower Gel", cat: "body", price: 3490, old: null, rating: 4.6, reviews: 12, tag: "new", icon: Droplet, theme: "peach" },
  { id: 4, name: "Oat Milk Daily Moisture Body Wash 1L", cat: "body", price: 6780, old: null, rating: 4.9, reviews: 22, tag: "new", icon: Leaf, theme: "sage" },
  { id: 5, name: "Niacinamide 10% + Zinc Serum 30ml", cat: "skin", price: 5250, old: 6950, rating: 5.0, reviews: 41, tag: "sale", icon: Droplet, theme: "sage" },
  { id: 6, name: "Glow Acid 7% Toning Solution", cat: "skin", price: 6500, old: 7500, rating: 4.9, reviews: 33, tag: "sale", icon: Droplet, theme: "blush" },
  { id: 7, name: "Azelaic Bright 10% Suspension 30ml", cat: "face", price: 7650, old: 8550, rating: 4.7, reviews: 15, tag: null, icon: Flower2, theme: "peach", soldOut: true },
  { id: 8, name: "Salicylic Clarity Cleanser 237ml", cat: "face", price: 9480, old: null, rating: 4.4, reviews: 20, tag: "bestseller", icon: Flower2, theme: "sage" },
  { id: 9, name: "Centella Calm Serum 30ml", cat: "skin", price: 8050, old: null, rating: 4.8, reviews: 27, tag: "bestseller", icon: Droplet, theme: "blush" },
  { id: 10, name: "Blemish Control Face Cleanser 236ml", cat: "face", price: 9350, old: null, rating: 4.6, reviews: 19, tag: null, icon: Flower2, theme: "peach" },
  { id: 11, name: "Everyday Salicylic Solution 2%", cat: "skin", price: 7500, old: null, rating: 4.5, reviews: 14, tag: null, icon: Droplet, theme: "sage" },
  { id: 12, name: "Tone-Even Capsule Cream 75ml", cat: "face", price: 8150, old: 8950, rating: 5.0, reviews: 8, tag: "sale", icon: Flower2, theme: "blush" },
  { id: 13, name: "Weightless Mineral Fluid SPF50+ 50ml", cat: "skin", price: 7980, old: null, rating: 4.9, reviews: 31, tag: "bestseller", icon: Sparkles, theme: "peach" },
  { id: 14, name: "Cedar & Amber Fragrance Spray 100ml", cat: "perfume", price: 11200, old: null, rating: 4.8, reviews: 11, tag: null, icon: Wind, theme: "sage" },
];
