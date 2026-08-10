import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ProductSection from "../ProductSection";
import { PRODUCTS } from "../../data/products";
import { useAppContext } from "../../context/AppContext";

export default function Shop() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("search") ?? "";
  const { addToCart, wishlist, toggleWish } = useAppContext();

  const filtered = useMemo(() => {
    if (!query.trim()) return PRODUCTS;
    const q = query.toLowerCase();
    return PRODUCTS.filter((p) => p.name.toLowerCase().includes(q) || p.cat.includes(q));
  }, [query]);

  return (
    <ProductSection
      id="products"
      eyebrow={query ? "Search Results" : "Every Product"}
      title="Shop All"
      products={filtered}
      layout="grid"
      onAdd={addToCart}
      wishlist={wishlist}
      toggleWish={toggleWish}
      showViewAll={false}
      emptyMessage={`No products match "${query}". Try a different search.`}
    />
  );
}
