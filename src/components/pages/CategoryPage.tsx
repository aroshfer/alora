import { useMemo } from "react";
import { useParams } from "react-router-dom";
import ProductSection from "../ProductSection";
import { PRODUCTS } from "../../data/products";
import { CATEGORIES } from "../../data/categories";
import { useAppContext } from "../../context/AppContext";
import NotFound from "./NotFound";

export default function CategoryPage() {
  const { categoryId } = useParams();
  const { addToCart, wishlist, toggleWish } = useAppContext();

  const category = CATEGORIES.find((c) => c.id === categoryId);
  const products = useMemo(() => PRODUCTS.filter((p) => p.cat === categoryId), [categoryId]);

  if (!category) return <NotFound />;

  return (
    <ProductSection
      eyebrow="Category"
      title={category.name}
      products={products}
      layout="grid"
      onAdd={addToCart}
      wishlist={wishlist}
      toggleWish={toggleWish}
      showViewAll={false}
      emptyMessage={`No products found in ${category.name} yet.`}
    />
  );
}
