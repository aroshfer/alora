import type { LucideIcon } from "lucide-react";

export type ThemeColor = "sage" | "blush" | "peach";
export type ProductTag = "new" | "sale" | "bestseller" | null;

export interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
  sub: string[];
}

export interface Product {
  id: number;
  name: string;
  cat: string;
  price: number;
  old?: number | null;
  rating: number;
  reviews: number;
  tag?: ProductTag;
  icon: LucideIcon;
  theme: ThemeColor;
  soldOut?: boolean;
}

export interface CartItem extends Product {
  qty: number;
}

export interface HeroSlide {
  eyebrow: string;
  title: string;
  sub: string;
  cta: string;
}

export interface ReviewItem {
  name: string;
  text: string;
  initial: string;
}

export interface JournalPost {
  title: string;
  date: string;
}

export interface Address {
  id: string;
  label: string;
  line1: string;
  line2: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface SavedPaymentMethod {
  id: string;
  token: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  cardholderName: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phone: string;
  addresses: Address[];
  paymentMethods: SavedPaymentMethod[];
  createdAt: string;
}

export interface OrderItem {
  productId: number;
  name: string;
  price: number;
  qty: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress: Address;
  paymentSummary: { brand: string; last4: string };
  authorizationId: string;
  status: string;
  createdAt: string;
}
