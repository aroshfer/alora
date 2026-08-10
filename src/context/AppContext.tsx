import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { useCart } from "../hooks/useCart";
import { useWishlist } from "../hooks/useWishlist";
import { useToast } from "../hooks/useToast";
import type { CartItem, Product } from "../types";

interface AppContextValue {
  cart: CartItem[];
  cartCount: number;
  subtotal: number;
  addToCart: (p: Product) => void;
  changeQty: (id: number, delta: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  wishlist: number[];
  toggleWish: (id: number) => void;
  toast: string | null;
  showToast: (msg: string) => void;
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const { cart, addToCart: addToCartBase, changeQty, removeItem, clearCart, cartCount, subtotal } = useCart();
  const { wishlist, toggleWish } = useWishlist();
  const { toast, showToast } = useToast();
  const [cartOpen, setCartOpen] = useState(false);

  const addToCart = (p: Product) => {
    addToCartBase(p);
    showToast(`Added "${p.name}" to your bag`);
  };

  const value: AppContextValue = {
    cart,
    cartCount,
    subtotal,
    addToCart,
    changeQty,
    removeItem,
    clearCart,
    wishlist,
    toggleWish,
    toast,
    showToast,
    cartOpen,
    openCart: () => setCartOpen(true),
    closeCart: () => setCartOpen(false),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within an AppProvider");
  return ctx;
}
