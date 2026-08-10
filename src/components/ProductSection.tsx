import { Link } from "react-router-dom";
import type { Product } from "../types";
import ProductCard from "./ProductCard";

interface ProductSectionProps {
  id?: string;
  eyebrow: string;
  title: string;
  products: Product[];
  layout: "row" | "grid";
  onAdd: (p: Product) => void;
  wishlist: number[];
  toggleWish: (id: number) => void;
  showViewAll?: boolean;
  emptyMessage?: string;
}

export default function ProductSection({
  id,
  eyebrow,
  title,
  products,
  layout,
  onAdd,
  wishlist,
  toggleWish,
  showViewAll = true,
  emptyMessage,
}: ProductSectionProps) {
  return (
    <section className="section wrap" id={id}>
      <div className="section-head">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
        </div>
        {showViewAll && (
          <Link className="view-all" to="/shop">
            View all
          </Link>
        )}
      </div>

      {products.length === 0 && emptyMessage ? (
        <p style={{ color: "#8a8375" }}>{emptyMessage}</p>
      ) : layout === "row" ? (
        <div className="scroll-row">
          {products.map((p) => (
            <div key={p.id} style={{ flex: "0 0 240px" }}>
              <ProductCard product={p} onAdd={onAdd} wishlist={wishlist} toggleWish={toggleWish} />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={onAdd} wishlist={wishlist} toggleWish={toggleWish} />
          ))}
        </div>
      )}
    </section>
  );
}
