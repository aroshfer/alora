import ProductSection from "../ProductSection";
import { PRODUCTS } from "../../data/products";
import { useAppContext } from "../../context/AppContext";

export default function WishlistPage() {
  const { wishlist, addToCart, toggleWish } = useAppContext();
  const products = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <ProductSection
      eyebrow="Saved"
      title="Your Wishlist"
      products={products}
      layout="grid"
      onAdd={addToCart}
      wishlist={wishlist}
      toggleWish={toggleWish}
      showViewAll={false}
      emptyMessage="You haven't saved anything yet. Tap the heart on any product to add it here."
    />
  );
}
