import {
  Flower2, Droplet, Wind, Leaf, Sparkles, FlaskConical, ShieldCheck, Baby,
} from "lucide-react";
import type { Category } from "../types";

export const CATEGORIES: Category[] = [
  { id: "face", name: "Face Care", icon: Flower2, sub: ["Acne Care", "Brightening", "Anti-Aging", "Dark Spot Care", "Sensitive Skin"] },
  { id: "skin", name: "Skin Care", icon: Droplet, sub: ["Cleansers", "Toners", "Serums", "Moisturizers", "Sunscreens"] },
  { id: "hair", name: "Hair Care", icon: Wind, sub: ["Shampoo", "Conditioner", "Hair Oils", "Hair Serums", "Dandruff Care"] },
  { id: "body", name: "Body Care", icon: Leaf, sub: ["Body Lotion", "Body Wash", "Body Scrub", "Hand Cream", "Deodorants"] },
  { id: "perfume", name: "Perfumes", icon: Sparkles, sub: ["Women's", "Men's", "Body Mist", "Gift Sets"] },
  { id: "vitamins", name: "Vitamins", icon: FlaskConical, sub: ["Collagen", "Vitamin C", "Multivitamins", "Wellness"] },
  { id: "men", name: "Men's Care", icon: ShieldCheck, sub: ["Face Wash", "Moisturizer", "Beard Care", "Fragrance"] },
  { id: "baby", name: "Baby Care", icon: Baby, sub: ["Baby Wash", "Baby Lotion", "Kids Skin Care"] },
];

export const CONCERNS: string[] = [
  "Acne", "Dry Skin", "Sensitive Skin", "Uneven Tone",
  "Anti-Aging", "Pigmentation", "Oily Skin", "Dark Spots",
];

export const INGREDIENTS: string[] = [
  "Niacinamide", "Centella Asiatica", "Marine Collagen", "Hyaluronic Acid",
  "Vitamin C", "Azelaic Acid", "Ceramides", "Zinc PCA",
];
