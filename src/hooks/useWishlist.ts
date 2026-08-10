import { useState } from "react";

export function useWishlist() {
  const [wishlist, setWishlist] = useState<number[]>([]);

  const toggleWish = (id: number) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]));
  };

  return { wishlist, toggleWish };
}
